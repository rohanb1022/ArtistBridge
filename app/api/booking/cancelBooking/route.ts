import { withAuth } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const user = await withAuth(req);
  if (!user || (user.role !== "artist" && user.role !== "organizer")) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return Response.json({ message: "Booking ID is required" }, { status: 400 });
    }

    // Fetch booking to verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    // Check if the user owns the booking
    if (
      (user.role === "artist" && booking.artistId !== user.id) ||
      (user.role === "organizer" && booking.organizerId !== user.id)
    ) {
      return Response.json({ message: "You do not own this booking" }, { status: 403 });
    }

    // Check if it's already cancelled
    if (booking.status === "CANCELLED") {
      return Response.json({ message: "Booking already cancelled" }, { status: 400 });
    }

    // Update booking status to CANCELLED
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    return Response.json({ message: "Booking cancelled", booking: cancelledBooking }, { status: 200 });

  } catch (error) {
    console.error("Error cancelling booking:", error);
    return Response.json({ message: "Internal server error", error }, { status: 500 });
  }
}
