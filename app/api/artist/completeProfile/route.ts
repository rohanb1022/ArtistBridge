/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

export const runtime = "nodejs";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function PUT(req : Request) {

    // Checking whether the user is authorized or not
    const user = await withAuth(req);
    console.log("user" , user)
    if (!user || user.role !== "artist") return Response.json({message : "Unauthorized"} , {status : 401})

    const data = await req.json();
    const { category , bio , price ,bestEvent } = data;

    if ( !category || !bio || !price || !bestEvent){ 
        return Response.json({message : "Please provide all the fields once"} , {status : 400})
    }

    try {
        const updatedFields =  await prisma.artist.update({
            where : { id : user.id },
            data : {
                category,
                bio,
                price,
                bestEvent,
            },
        });

        // Sync with Pinecone Vector DB in real-time
        try {
            const textToEmbed = `
              Artist Name: ${updatedFields.name}
              Category: ${updatedFields.category.join(", ")}
              City: ${updatedFields.city || "Anywhere"}
              Base Price: ₹${updatedFields.price || 0}
              Bio: ${updatedFields.bio || ""}
              Best Event Performed: ${updatedFields.bestEvent || ""}
            `.trim();

            const embeddingResponse = await hf.featureExtraction({
              model: "sentence-transformers/all-MiniLM-L6-v2",
              inputs: textToEmbed,
            });

            const embedding = Array.isArray(embeddingResponse) ? embeddingResponse as number[] : [];

            if (embedding.length > 0) {
              const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "artistbridge");
              await index.upsert({
                records: [{
                  id: updatedFields.id.toString(),
                  values: embedding,
                  metadata: {
                    name: updatedFields.name,
                    city: updatedFields.city || "",
                    category: updatedFields.category.join(", "),
                    price: updatedFields.price || 0,
                    text: textToEmbed,
                  },
                }]
              });
              console.log(`Successfully auto-synced artist ${updatedFields.name} to Pinecone.`);
            }
        } catch (pineconeError) {
            console.error("Failed to auto-sync to Pinecone:", pineconeError);
            // We don't crash the request if Pinecone fails, as DB updated successfully
        }

        const { password : _ , ...cleanData } = updatedFields;
        return Response.json({ message: "Profile updated", artist: cleanData }, { status: 200 });

    } catch (error) {
        console.log("error occured" + error)
        return Response.json({message : "Some error occurred"} , { status : 500 })
    }
    
}