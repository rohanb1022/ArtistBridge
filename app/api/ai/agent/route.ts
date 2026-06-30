import { NextResponse } from "next/server";
import { organizerAgent } from "@/lib/agents/organizerAgent";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { verifyToken } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// Fallback search handler if Groq throws 429/500/rate limit errors
async function handleOrganizerFallback(messages: any[]) {
  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
  const lowerMsg = lastUserMsg.toLowerCase();
  
  const categories = [
    "SINGER", "DANCER", "MAGICIAN", "COMEDIAN", "DJ", 
    "INSTRUMENTALIST", "MIME", "THEATRE", "BEATBOXER", 
    "SPEAKER", "PAINTER", "POET", "PHOTOGRAPHER", "MODEL", "CIRCUS"
  ];
  
  let matchedCategory: string | undefined = undefined;
  for (const cat of categories) {
    if (lowerMsg.includes(cat.toLowerCase())) {
      matchedCategory = cat;
      break;
    }
  }
  
  const cities = ["mumbai", "delhi", "pune", "bangalore", "kolkata", "chennai", "hyderabad", "goa", "jaipur"];
  let matchedCity: string | undefined = undefined;
  for (const city of cities) {
    if (lowerMsg.includes(city)) {
      matchedCity = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }
  
  let maxPrice: number | undefined = undefined;
  const kMatches = lowerMsg.match(/(\d+)\s*k/);
  if (kMatches) {
    maxPrice = parseInt(kMatches[1]) * 1000;
  } else {
    const priceMatches = lowerMsg.match(/(?:rs\.?|inr|₹)?\s*(\d{4,6})/);
    if (priceMatches) {
      maxPrice = parseInt(priceMatches[1]);
    }
  }

  const whereClause: any = {};
  if (matchedCategory) {
    whereClause.category = { has: matchedCategory };
  }
  if (matchedCity) {
    whereClause.city = { equals: matchedCity, mode: 'insensitive' };
  }
  if (maxPrice) {
    whereClause.price = { lte: maxPrice };
  }

  const artists = await prisma.artist.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      city: true,
      category: true,
      price: true,
      bio: true,
    },
    take: 3,
  });

  let reply = "";
  if (artists.length > 0) {
    reply += `I searched the database and found some excellent ${matchedCategory ? `${matchedCategory.toLowerCase()}s` : "artists"} ${matchedCity ? `in ${matchedCity}` : ""} ${maxPrice ? `under ₹${maxPrice}` : ""} for you! Here are their profiles:`;
  } else {
    reply += "I searched our database but couldn't find an exact match for that request. Could you try adjusting the category (e.g., 'Singer' or 'DJ') or city?";
  }

  return { reply, artists };
}

export async function POST(req: Request) {
  let organizerId = "";
  let rawMessages: any[] = [];
  
  try {
    const body = await req.json();
    rawMessages = body.messages || [];

    if (!rawMessages || !Array.isArray(rawMessages)) {
      return NextResponse.json({ message: "Messages array is required" }, { status: 400 });
    }

    // Attempt to extract organizer ID from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      try {
        const payload = await verifyToken(token);
        if (payload && payload.id) {
          organizerId = payload.id;
        }
      } catch (e) {
        console.warn("Token verification failed in AI agent route", e);
      }
    }

    // Convert raw JSON messages to LangChain message classes
    const langchainMessages: any[] = [];

    // Inject organizer context and current date as the first system message
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const contextParts: string[] = [`SYSTEM CONTEXT: Today's date is ${currentDate}.`];
    if (organizerId) {
      contextParts.push(`The user is an organizer with ID: ${organizerId}. You MUST use this ID when invoking the create_booking_request tool.`);
    }
    langchainMessages.push(new SystemMessage(contextParts.join(" ")));

    // Add the conversation messages
    for (const m of rawMessages) {
      if (m.role === "user") {
        langchainMessages.push(new HumanMessage(m.content));
      } else if (m.role === "assistant") {
        langchainMessages.push(new AIMessage(m.content));
      } else if (m.role === "system") {
        langchainMessages.push(new SystemMessage(m.content));
      } else {
        langchainMessages.push(new HumanMessage(m.content));
      }
    }

    // Run the LangGraph agent
    const finalState = await organizerAgent.invoke(
      { messages: langchainMessages },
      { configurable: { thread_id: organizerId || "anonymous" } }
    );

    const latestMessage = finalState.messages[finalState.messages.length - 1];

    let artists = [];
    try {
      const searchMessages = finalState.messages.filter((m: any) => m._getType() === "tool" && m.name === "search_artists");
      if (searchMessages.length > 0) {
        const lastSearchStr = searchMessages[searchMessages.length - 1].content;
        const parsed = JSON.parse(lastSearchStr);
        if (Array.isArray(parsed)) {
          artists = parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to extract artist data from graph state", e);
    }

    return NextResponse.json({ 
      reply: latestMessage.content,
      artists: artists 
    });

  } catch (error: any) {
    // Catch rate limits, API failures, credentials errors, etc. and fall back gracefully
    console.error("AI Agent Route: Falling back to direct database query due to error:", error);
    try {
      const fallbackResult = await handleOrganizerFallback(rawMessages);
      return NextResponse.json(fallbackResult);
    } catch (fallbackError) {
      return NextResponse.json(
        { reply: "Sorry, I'm currently unavailable and database fallback also encountered an error." },
        { status: 500 }
      );
    }
  }
}
