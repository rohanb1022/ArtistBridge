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

    const now = new Date();

    // Filter out requests whose expiry date or event date has passed
    const activeRequests = matchingRequests.filter((r) => {
      if (r.expiryDate) {
        const exp = new Date(r.expiryDate);
        if (!isNaN(exp.getTime())) {
          exp.setHours(23, 59, 59, 999);
          if (exp < now) return false;
        }
      }
      const eventDate = new Date(r.date);
      if (!isNaN(eventDate.getTime())) {
        eventDate.setHours(23, 59, 59, 999);
        if (eventDate < now) return false;
      }
      return true;
    });

    return Response.json({ data: activeRequests }, { status: 200 });
  } catch (error) {
    console.error("Error in getRequest for artist:", error);
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
