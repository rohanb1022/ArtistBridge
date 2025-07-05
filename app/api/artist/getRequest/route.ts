import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
    });

    if (!artist || !artist.category) {
      return Response.json(
        { message: "Artist not found or category missing" },
        { status: 404 }
      );
    }

    const matchingRequests = await prisma.artistRequest.findMany({
      where: {
        category: { in: artist.category },
        status: "PENDING", 
      },
    });

    return Response.json({data : matchingRequests }, { status: 200 });
  } catch (error) {
    console.error("Error in getRequest for artist:", error);
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
