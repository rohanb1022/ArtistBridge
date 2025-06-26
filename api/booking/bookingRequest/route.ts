import { withAuth } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient();

export async function POST(req: Request) {
  const client = await withAuth(req);
  if (!client || client.role !== "organizer") {
    return Response.json(
      { message: "User not found , Please try to login" },
      { status: 401 }
    ); // for unauthorized access it should be 401
  }

  const data = await req.json();
  const {artistId , city, category, price, eventDate, timing } = data;
  if (!artistId || !city || !category || !price || !eventDate || !timing) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const org = await prisma.organizer.findUnique({ where: { id: client.id } });
    if (!org) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    const newBookingRequest = await prisma.booking.create({
      data: {
        artistId,
        organizerId: org.id,
        city,
        category,
        price,
        eventDate,
        timing,
      },
    });

    return Response.json(
      {
        message: "request created successfully",
        newBookingRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error occurred", error);
    return Response.json({ message: "Some Internal Error" }, { status: 500 });
  }
}
