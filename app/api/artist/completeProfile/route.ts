/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import { moderateText } from "@/lib/ai/moderation";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  // Checking whether the user is authorized or not
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { category, bio, price, bestEvent, instagramUrl, youtubeUrl, introVideoUrl, city } = data;

  if (!category || !bio || !price || !bestEvent) {
    return Response.json(
      { message: "Please provide all required profile fields (Category, Price, Bio, Best Event)" },
      { status: 400 }
    );
  }

  // Verify existing artist
  const existingArtist = await prisma.artist.findUnique({
    where: { id: user.id },
  });

  if (!existingArtist) {
    return Response.json({ message: "Artist not found" }, { status: 404 });
  }

  const artistCity = (city || existingArtist.city || "").trim();
  if (!artistCity) {
    return Response.json(
      { message: "City is required so event organizers can discover you." },
      { status: 400 }
    );
  }

  // Moderate Bio
  const bioModeration = await moderateText(bio);
  if (bioModeration.isToxic) {
    return Response.json(
      { message: "Profile update blocked: bio content violates community guidelines (flagged as toxic)." },
      { status: 400 }
    );
  }

  // Moderate Best Event
  const eventModeration = await moderateText(bestEvent);
  if (eventModeration.isToxic) {
    return Response.json(
      { message: "Profile update blocked: best event content violates community guidelines (flagged as toxic)." },
      { status: 400 }
    );
  }

  try {
    const updatedFields = await prisma.artist.update({
      where: { id: user.id },
      data: {
        city: artistCity,
        category: Array.isArray(category) ? category : [category],
        bio,
        price: Number(price),
        bestEvent,
        instagramUrl: instagramUrl || null,
        youtubeUrl: youtubeUrl || null,
        introVideoUrl: introVideoUrl || null,
      },
    });

    // Sync with Pinecone Vector DB in real-time if keys are available
    if (process.env.PINECONE_API_KEY) {
      try {
        const pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY,
        });

        const textToEmbed = `
          Artist Name: ${updatedFields.name}
          Category: ${updatedFields.category.join(", ")}
          City: ${updatedFields.city || "Anywhere"}
          Base Price: ₹${updatedFields.price || 0}
          Bio: ${updatedFields.bio || ""}
          Best Event Performed: ${updatedFields.bestEvent || ""}
        `.trim();

        const hfKey = process.env.HUGGINGFACE_API_KEY;
        const hf = new HfInference(hfKey || undefined);

        const embeddingResponse = await hf.featureExtraction({
          model: "sentence-transformers/all-MiniLM-L6-v2",
          inputs: textToEmbed,
        });

        const embedding = Array.isArray(embeddingResponse) ? (embeddingResponse as number[]) : [];

        if (embedding.length > 0) {
          const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "artistbridge-new");
          await index.upsert({
            records: [
              {
                id: updatedFields.id.toString(),
                values: embedding,
                metadata: {
                  name: updatedFields.name,
                  city: updatedFields.city || "",
                  category: updatedFields.category.join(", "),
                  price: updatedFields.price || 0,
                  text: textToEmbed,
                },
              },
            ],
          });
          console.log(`Successfully auto-synced artist ${updatedFields.name} to Pinecone vector database.`);
        }
      } catch (pineconeError) {
        console.error("Failed to auto-sync to Pinecone:", pineconeError);
      }
    } else {
      console.warn("PINECONE_API_KEY is not defined. Skipping auto-sync to Pinecone.");
    }

    const { password: _, ...cleanData } = updatedFields;
    return Response.json(
      {
        message: "Profile updated and vector database synced successfully",
        artist: cleanData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in completeProfile:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
