import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { searchArtistsTool, checkArtistAvailabilityTool, createBookingRequestTool } from "./tools";
import { SystemMessage, AIMessage, HumanMessage } from "@langchain/core/messages";

// 1. Initialize Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxTokens: 1024,
});

// 2. Bind tools
const tools = [searchArtistsTool, checkArtistAvailabilityTool, createBookingRequestTool];
const boundModel = model.bindTools(tools);
const toolNode = new ToolNode(tools);

// 3. Define the Agent Node function
async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;

  // Always prepend the agent system prompt (the context SystemMessage from the route
  // is different — it provides organizer ID and date, while this one provides workflow instructions)
  const sysMsg = new SystemMessage(`You are the AI Event Booking Co-pilot for "ArtistBridge".
Your role is to help Event Organizers find and book the perfect artists.

You have these tools:
1. search_artists — Search for artists. Supports filtering by "name" (partial match), "query" (semantic), "category", "city", "maxPrice", and "date".
2. check_artist_availability — Check if a specific artist is available on a given date. Requires "artistId" and "date".
3. create_booking_request — Create a booking request. Requires explicit user confirmation first.

CRITICAL WORKFLOW — FOLLOW THESE STEPS EXACTLY:

STEP 1 — SEARCH: When the user mentions an artist by name (e.g., "book Dan", "find Priya"), you MUST call search_artists with the "name" parameter. Do NOT guess or hallucinate artist details. Do NOT respond with text suggestions without searching first.

STEP 2 — AVAILABILITY: When the user mentions a date (e.g., "on 2nd July", "July 2"), and you have found the artist from Step 1, you MUST call check_artist_availability with the artist's "id" from the search results and the "date" in YYYY-MM-DD format. Do NOT skip this step.

STEP 3 — REPORT: After checking availability:
- If the artist IS available: Tell the user the artist is available on that date and ask if they want to proceed with booking. List the details you have and ask for any missing info (event name, city, price, etc.).
- If the artist is NOT available: Clearly inform the user that the artist is already booked on that date. Suggest they pick a different date or ask if they'd like to search for alternative artists.

STEP 4 — BOOK: Only call create_booking_request AFTER the user explicitly confirms (e.g., "yes, book them", "go ahead"). Never auto-book.

IMPORTANT RULES:
- Always use tools. Never make up or suggest artists without calling search_artists first.
- If search returns no results, say so honestly. Do not invent artists.
- Convert natural language dates to YYYY-MM-DD format (e.g., "2nd July" or "July 2" → "2026-07-02", "tomorrow" → the next day's date based on context).
- Convert natural language times to a readable format (e.g., "10AM" → "10:00 AM").
- When you have the organizer ID from context, use it for bookings. Never ask the user for their organizer ID.
`);
  const currentMessages = [sysMsg, ...messages];

  const response = await boundModel.invoke(currentMessages);
  return { messages: [response] };
}

// 4. Define Graph Routing
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

// 5. Build Graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    __end__: "__end__",
  })
  .addEdge("tools", "agent");

// Compile graph
export const organizerAgent = workflow.compile();
