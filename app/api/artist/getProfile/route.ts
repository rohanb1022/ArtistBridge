import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await withAuth(req);

  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
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
      return Response.json({ message: "Artist not found" }, { status: 404 });
    }

    return Response.json({ data: artist }, { status: 200 });
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
