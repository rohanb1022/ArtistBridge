import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { getPendingBookingsTool } from "./tools";
import { SystemMessage, AIMessage, HumanMessage } from "@langchain/core/messages";

// 1. Initialize Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.1-8b-instant",
  temperature: 0.7,
  maxTokens: 1024,
});

// 2. Bind tools
const tools = [getPendingBookingsTool];
const boundModel = model.bindTools(tools);
const toolNode = new ToolNode(tools);

// 3. Define the Agent Node function
async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;

  // Add system instruction if it's the first message
  let currentMessages = messages;
  if (!messages.find(m => m instanceof SystemMessage)) {
    const sysMsg = new SystemMessage(`
      You are the AI Career Manager for an Artist on "ArtistBridge".
      Your role is to help the artist manage their bookings, draft professional replies to event organizers, and provide scheduling advice.
      
      You can:
      1. Check pending booking requests using the get_pending_bookings tool.
      
      CRITICAL INSTRUCTIONS:
      - Always be encouraging and professional.
      - Help the artist draft polite negotiation messages if they want to ask for a higher budget.
      - Present booking requests clearly.
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
export const artistAgent = workflow.compile();
