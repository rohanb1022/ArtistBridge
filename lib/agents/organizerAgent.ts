import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { searchArtistsTool, checkArtistAvailabilityTool, createBookingRequestTool } from "./tools";
import { SystemMessage, AIMessage, HumanMessage } from "@langchain/core/messages";

// 1. Initialize Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.1-8b-instant",
  temperature: 0.7,
  maxTokens: 1024,
});

// 2. Bind tools
const tools = [searchArtistsTool, checkArtistAvailabilityTool, createBookingRequestTool];
const boundModel = model.bindTools(tools);
const toolNode = new ToolNode(tools);

// 3. Define the Agent Node function
async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;

  // Add system instruction if it's the first message
  let currentMessages = messages;
  if (!messages.find(m => m instanceof SystemMessage)) {
    const sysMsg = new SystemMessage(`
      You are the AI Event Booking Co-pilot for "ArtistBridge".
      Your role is to help Event Organizers find and book the perfect artists.
      
      You can:
      1. Search for artists using the search_artists tool.
      2. Check artist availability using the check_artist_availability tool.
      3. Create a booking request using the create_booking_request tool.
      
      CRITICAL INSTRUCTIONS:
      - Always ask the user for confirmation before calling the create_booking_request tool. Do not draft bookings automatically without explicit "Yes, book them" approval.
      - Ensure you have all necessary details before creating a booking (Artist ID, Date, Time, City, Price, Category, Event Name).
      - If you perform a search, summarize the matches nicely. The UI will render artist cards if you provide the IDs or details.
      - Never hallucinate artists. If the database search returns empty, tell the user no matches were found.
    `);
    currentMessages = [sysMsg, ...messages];
  }

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
