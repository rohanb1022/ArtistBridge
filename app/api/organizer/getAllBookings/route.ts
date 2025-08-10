import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";


export async function GET(req: Request) {
  const client = await withAuth(req);
  if (!client || client.role !== "organizer") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const organizer = await prisma.organizer.findUnique({
      where: { id: client.id },
      include: {
        bookings: true,
      },
    });

    if (!organizer) {
      return Response.json({ message: "Organizer not found" }, { status: 400 });
    }
    //  Group by status
    const pending = organizer.bookings.filter((b: { status: string; }) => b.status === "PENDING");
    const confirmed = organizer.bookings.filter((b: { status: string; }) => b.status === "CONFIRMED");
    const cancelled = organizer.bookings.filter((b: { status: string; }) => b.status === "CANCELLED");

    const data = {
      pending,
      confirmed,
      cancelled,
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in getAllBookings (organizer):", error);
    return Response.json(
      { message: "Internal error while fetching organizer bookings", error },
      { status: 500 }
    );
  }
}
