import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.pathname.split("/").pop();
  const id = artistId as string;

  if (!id) {
    return Response.json(
      { message: "Invalid artist ID" },
      { status: 400 }
    );
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        category: true,
        bio: true,
        price: true,
        bestEvent: true,
        instagramUrl: true,
        youtubeUrl: true,
        introVideoUrl: true,
        created_at: true,
      },
    });

    if (!artist) {
      return Response.json(
        { message: "Artist not found" },
        { status: 404 }
      );
    }

    return Response.json({ data: artist }, { status: 200 });
  } catch (error) {
    console.error("Error fetching artist:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
