import { NextResponse } from "next/server";
import { artistAgent } from "@/lib/agents/artistAgent";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { verifyToken } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// Fallback search handler if Groq throws 429/500/rate limit errors
async function handleArtistFallback(artistId: string) {
  if (!artistId) {
    return { reply: "I'm currently running in offline mode. Please log in to view your bookings.", bookings: [] };
  }

  const bookings = await prisma.booking.findMany({
    where: {
      artistId,
      status: "PENDING",
    },
    select: {
      id: true,
      eventName: true,
      organizerName: true,
      date: true,
      price: true,
    },
  });

  let reply = "";
  if (bookings.length > 0) {
    reply += `I've checked your schedule. You have the following pending booking requests to review:`;
  } else {
    reply += "Great news! I checked your schedule and you have no pending booking requests to review right now.";
  }

  return { reply, bookings };
}

export async function POST(req: Request) {
  let artistId = "";
  let rawMessages: any[] = [];
  
  try {
    const body = await req.json();
    rawMessages = body.messages || [];

    if (!rawMessages || !Array.isArray(rawMessages)) {
      return NextResponse.json({ message: "Messages array is required" }, { status: 400 });
    }

    // Attempt to extract artist ID from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      try {
        const payload = await verifyToken(token);
        if (payload && payload.id) {
          artistId = payload.id;
        }
      } catch (e) {
        console.warn("Token verification failed in artist AI manager route", e);
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

    if (artistId) {
      langchainMessages.push(new SystemMessage(`
        SYSTEM CONTEXT: The user is an artist with ID: ${artistId}. 
        You MUST use this ID when invoking the get_pending_bookings tool.
      `));
    }

    // Run the LangGraph agent
    const finalState = await artistAgent.invoke(
      { messages: langchainMessages },
      { configurable: { thread_id: artistId || "anonymous_artist" } }
    );

    const latestMessage = finalState.messages[finalState.messages.length - 1];

    let bookings = [];
    try {
      const toolMessages = finalState.messages.filter((m: any) => m._getType() === "tool" && m.name === "get_pending_bookings");
      if (toolMessages.length > 0) {
        const lastToolStr = toolMessages[toolMessages.length - 1].content;
        const parsed = JSON.parse(lastToolStr);
        if (Array.isArray(parsed)) {
          bookings = parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to extract bookings data from graph state", e);
    }

    return NextResponse.json({ 
      reply: latestMessage.content,
      bookings: bookings 
    });

  } catch (error: any) {
    // Catch rate limits, API failures, credentials errors, etc. and fall back gracefully
    console.error("Artist AI Manager Route: Falling back to direct database query due to error:", error);
    try {
      const fallbackResult = await handleArtistFallback(artistId);
      return NextResponse.json(fallbackResult);
    } catch (fallbackError) {
      return NextResponse.json(
        { reply: "Sorry, I'm currently unavailable and database fallback also encountered an error." },
        { status: 500 }
      );
    }
  }
}
