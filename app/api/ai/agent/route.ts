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

  let reply = "👋 I'm currently running in **Resilient Search Mode** (bypass API rate limit).\n\n";
  if (artists.length > 0) {
    reply += `I directly queried the database and found matching artists ${matchedCategory ? `(${matchedCategory}s)` : ""} ${matchedCity ? `in ${matchedCity}` : ""} ${maxPrice ? `under ₹${maxPrice}` : ""}:`;
  } else {
    reply += "I searched our records but couldn't find any direct matches. Try typing a generic category (e.g., 'Singer' or 'DJ') and city name (e.g., 'Mumbai').";
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
    const langchainMessages = rawMessages.map((m: any) => {
      if (m.role === "user") {
        return new HumanMessage(m.content);
      } else if (m.role === "assistant") {
        return new AIMessage(m.content);
      } else if (m.role === "system") {
        return new SystemMessage(m.content);
      }
      return new HumanMessage(m.content);
    });

    if (organizerId) {
      langchainMessages.push(new SystemMessage(`
        SYSTEM CONTEXT: The user is an organizer with ID: ${organizerId}. 
        You MUST use this ID when invoking the create_booking_request tool.
      `));
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
