import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { updatedStatus, requestId } = data;

  try {
    const artist = await prisma.artist.findUnique({ where: { id: user.id } });
    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 400 });
    }

    if (!requestId) {
      return Response.json({ message: "Request ID is required" }, { status: 400 });
    }

    const bookingRequest = await prisma.booking.findUnique({
      where: { id: requestId },
    });

    if (!bookingRequest) {
      return Response.json({ message: "Booking request not found" }, { status: 404 });
    }

    if (bookingRequest.artistId !== user.id) {
      return Response.json({ message: "You are not authorized to accept this booking" }, { status: 403 });
    }

    if (bookingRequest.status !== "PENDING") {
      return Response.json(
        { message: `This request is already ${bookingRequest.status.toLowerCase()} and cannot be accepted.` },
        { status: 400 }
      );
    }

    const now = new Date();

    // 1. Check if expiry date has passed
    if (bookingRequest.expiryDate) {
      const expDate = new Date(bookingRequest.expiryDate);
      if (!isNaN(expDate.getTime())) {
        // Allow artist to accept until the end of the expiry day
        expDate.setHours(23, 59, 59, 999);
        if (expDate < now) {
          await prisma.booking.update({
            where: { id: requestId },
            data: { status: "EXPIRED" },
          });
          return Response.json(
            { message: `This request expired on ${bookingRequest.expiryDate} and can no longer be accepted.` },
            { status: 400 }
          );
        }
      }
    }

    // 2. Check if the event date has already passed
    if (bookingRequest.date) {
      let eventDate: Date;
      if (bookingRequest.time && bookingRequest.time.includes(":")) {
        eventDate = new Date(`${bookingRequest.date}T${bookingRequest.time}`);
      } else {
        eventDate = new Date(bookingRequest.date);
        eventDate.setHours(23, 59, 59, 999);
      }

      if (!isNaN(eventDate.getTime()) && eventDate < now) {
        await prisma.booking.update({
          where: { id: requestId },
          data: { status: "EXPIRED" },
        });
        return Response.json(
          { message: "The event date has already passed. This request can no longer be accepted." },
          { status: 400 }
        );
      }
    }

    const updatedRequest = await prisma.booking.update({
      where: { id: requestId },
      data: {
        status: updatedStatus || "CONFIRMED",
      },
    });

    return Response.json(
      { message: "Booking accepted successfully", updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal error at accepting request function", error);
    return Response.json(
      { message: "Internal error at accepting request function", error },
      { status: 500 }
    );
  }
}
