import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await withAuth(req);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, content } = await req.json();

  if (!bookingId || !content?.trim()) {
    return Response.json(
      { message: "bookingId and content are required" },
      { status: 400 }
    );
  }

  try {
    // Verify the booking and that the sender is a participant
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

    const senderName =
      user.role === "artist" ? booking.artistName : booking.organizerName;

    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId: user.id as string,
        senderRole: user.role,
        senderName,
        content: content.trim(),
      },
    });

    return Response.json({ data: message }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
