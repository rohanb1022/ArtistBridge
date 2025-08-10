import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";


export async function PUT(req: Request) {
  const user = await withAuth(req);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try { 
    const { requestId , updatedStatus } = await req.json();

    if (!requestId) {
      return Response.json({ message: "Booking ID is required" }, { status: 400 });
    }

    if (updatedStatus && updatedStatus !== "CANCELLED") {
      return Response.json({ message: "Invalid status update" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: requestId },
    });

    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    const CANCELLEDBooking = await prisma.booking.update({
      where: { id: requestId },
      data: { status: updatedStatus || "CANCELLED" },
    });

    return Response.json({ message: "Booking CANCELLED successfully", booking: CANCELLEDBooking }, { status: 200 });

  } catch (error) {
    console.error("Error rejecting booking:", error);
    return Response.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
