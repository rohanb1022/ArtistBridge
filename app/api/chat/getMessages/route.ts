import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return Response.json({ message: "bookingId is required" }, { status: 400 });
  }

  try {
    // Verify the booking exists and the requester is a participant
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    const isParticipant =
      (user.role === "artist" && booking.artistId === user.id) ||
      (user.role === "organizer" && booking.organizerId === user.id);

    if (!isParticipant) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== "CONFIRMED") {
      return Response.json(
        { message: "Chat is only available for confirmed bookings" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { bookingId },
      orderBy: { createdAt: "asc" },
    });

    return Response.json({ data: messages, booking }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
