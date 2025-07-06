import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const artistId = url.pathname.split("/").pop(); 


  try {
    const id = parseInt(artistId ?? ""); // safely parse it
    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 404 });
    }

    return Response.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
