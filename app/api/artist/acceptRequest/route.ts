export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export async function PUT(req: Request) {
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

    const now = new Date();

    // Check if expiry date has passed
    if (request.expiryDate) {
      const expDate = new Date(request.expiryDate);
      if (!isNaN(expDate.getTime())) {
        expDate.setHours(23, 59, 59, 999);
        if (expDate < now) {
          return Response.json(
            { message: `This request expired on ${request.expiryDate} and can no longer be accepted.` },
            { status: 400 }
          );
        }
      }
    }

    // Check if event date has passed
    const eventDate = new Date(request.date);
    if (!isNaN(eventDate.getTime())) {
      eventDate.setHours(23, 59, 59, 999);
      if (eventDate < now) {
        return Response.json(
          { message: "The event date has already passed. This request can no longer be accepted." },
          { status: 400 }
        );
      }
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
        expiryDate: request.expiryDate,
        status: "CONFIRMED",
        category: Array.isArray(artist.category) ? artist.category.join(", ") : artist.category,
        eventName: request.name,
        artistName: artist.name,
        organizerName: organizer.name,
        time: request.timing ?? "",
        price: request.maxBudget ?? 0,
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
