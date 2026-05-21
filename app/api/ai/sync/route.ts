import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Fetch all completed profiles
    const artists = await prisma.artist.findMany({
      where: {
        category: {
          isEmpty: false,
        },
      },
    });

    if (artists.length === 0) {
      return NextResponse.json({ message: "No artists found to sync." });
    }

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "artistbridge");

    // 2. Format artist data into text chunks and get embeddings
    const vectors = [];

    for (const artist of artists) {
      // Create a rich text representation of the artist
      const textToEmbed = `
        Artist Name: ${artist.name}
        Category: ${artist.category.join(", ")}
        City: ${artist.city || "Anywhere"}
        Base Price: ₹${artist.price || 0}
        Bio: ${artist.bio || ""}
        Best Event Performed: ${artist.bestEvent || ""}
      `.trim();

      // Get embedding from HuggingFace (Feature Extraction - using a standard 384-dim model)
      const embeddingResponse = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: textToEmbed,
      });

      // The response is an array of numbers (embedding)
      const embedding = Array.isArray(embeddingResponse) ? embeddingResponse as number[] : [];

      if (embedding.length > 0) {
        vectors.push({
          id: artist.id.toString(), // Pinecone requires string IDs
          values: embedding,
          metadata: {
            name: artist.name,
            city: artist.city || "",
            category: artist.category.join(", "),
            price: artist.price || 0,
            text: textToEmbed,
          },
        });
      }
    }

    // 3. Upsert to Pinecone
    if (vectors.length > 0) {
      // Pinecone SDK v4 requires passing an object with a 'records' property
      await index.upsert({ records: vectors });
    }

    return NextResponse.json({
      message: `Successfully synced ${vectors.length} artists to Pinecone.`,
    });
  } catch (error) {
    console.error("Error syncing to Pinecone:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
