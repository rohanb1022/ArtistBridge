import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return Response.json({ message: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.artistId !== user.id) {
      return Response.json({ message: "You are not allowed to reject this booking" }, { status: 403 });
    }

    if (booking.status !== "PENDING") {
      return Response.json({ message: "Only pending bookings can be rejected" }, { status: 400 });
    }

    const rejectedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REJECTED" },
    });

    return Response.json({ message: "Booking rejected successfully", booking: rejectedBooking }, { status: 200 });

  } catch (error) {
    console.error("Error rejecting booking:", error);
    return Response.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
