import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export async function PATCH(req: Request) {
  const user = await withAuth(req);

  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { requestId } = await req.json();

    if (!requestId) {
      return Response.json({ message: "Request ID is required" }, { status: 400 });
    }

    // Find the request
    const request = await prisma.artistRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return Response.json({ message: "Request not found" }, { status: 404 });
    }

    if (request.status !== "PENDING") {
      return Response.json({ message: "Request is not pending" }, { status: 400 });
    }

    // Get organizer using email
    const organizer = await prisma.organizer.findUnique({
      where: { email: request.email },
    });

    if (!organizer) {
      return Response.json({ message: "Organizer not found" }, { status: 404 });
    }

    // Get artist to extract category
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
    });

    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 404 });
    }

    // Step 1: Update request status
    await prisma.artistRequest.update({
      where: { id: requestId },
      data: {
        status: "MATCHED",
      },
    });

    // Step 2: Create new booking
    const booking = await prisma.booking.create({
      data: {
        artistId: user.id,
        organizerId: organizer.id,
        city: request.city,
        date: request.date,
        status: "CONFIRMED",
        category: Array.isArray(artist.category) ? artist.category.join(", ") : artist.category,
        eventName: request.name,
        artistName: artist.name,
        organizerName: organizer.name,
        time: request.timing ?? "", // Provide a default or get from request
        price: request.maxBudget ?? 0, // Use maxBudget from request as price
      },
    });

    return Response.json({
      message: "Request accepted and booking created",
      booking,
    }, { status: 200 });

  } catch (error) {
    console.error("Error accepting request:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
