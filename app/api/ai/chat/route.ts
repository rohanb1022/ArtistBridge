import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import Groq from "groq-sdk";

export const runtime = "nodejs";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    // 1. Embed the user's query
    const embeddingResponse = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: message,
    });
    const queryEmbedding = Array.isArray(embeddingResponse) ? embeddingResponse as number[] : [];

    // 2. Query Pinecone for the top 3 closest matching artists
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "artistbridge");
    let contextArtists = "";
    let matchedArtists: any[] = [];
    
    if (queryEmbedding.length > 0) {
      const queryResult = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true,
      });

      if (queryResult.matches && queryResult.matches.length > 0) {
        matchedArtists = queryResult.matches.map((match) => ({
          id: match.id,
          name: match.metadata?.name,
          city: match.metadata?.city,
          category: match.metadata?.category,
          price: match.metadata?.price,
        }));
        contextArtists = queryResult.matches
          .map((match) => match.metadata?.text)
          .join("\n\n---\n\n");
      }
    }

    // 3. Generate response using Groq (Llama 3)
    const prompt = `
      You are an AI booking assistant for "ArtistBridge".
      Your job is to help Event Organizers find the perfect artist from our database.
      Be friendly, professional, and concise.

      Here is the exact list of top matching artists currently available from our database:
      ${contextArtists || "NO ARTISTS FOUND."}

      Organizer's Request:
      "${message}"

      CRITICAL INSTRUCTION:
      If "NO ARTISTS FOUND." is shown above, you MUST say that you couldn't find an exact match in the database, and DO NOT SUGGEST ANY ARTISTS. DO NOT MAKE UP OR INVENT ARTISTS UNDER ANY CIRCUMSTANCES.
      If there are artists listed above, briefly introduce them and state that their profiles are attached below. Keep your text reply very short, as the UI will render detailed cards for these artists below your message.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "llama-3.1-8b-instant", // Fast and free model
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I couldn't process that right now.";

    return NextResponse.json({ reply, artists: matchedArtists });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
