import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const client = await withAuth(req);

  //Check if user is authenticated and has correct role
  if (!client || client.role !== "organizer") {
    return Response.json(
      { message: "User not found, please try to login" },
      { status: 401 }
    );
  }

  //  Get data from body
  const data = await req.json();
  const { artistId, city, price, date, time , eventName } = data;

  //  Check all required fields
  if (!artistId || !city || !price || !date || !time || !eventName) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  //  Validate artistId
  const parsedArtistId = Number(artistId);
  if (isNaN(parsedArtistId)) {
    return Response.json(
      { message: "Invalid artist ID" },
      { status: 400 }
    );
  }

  try {
    //  Get organizer info from DB
    const org = await prisma.organizer.findUnique({
      where: { id: client.id },
    });

    if (!org) {
      return Response.json({ message: "Organizer not found" }, { status: 401 });
    }

    //  Find artist by ID
    const artist = await prisma.artist.findUnique({
      where: { id: parsedArtistId },
    });

    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 404 });
    }

    // Create new booking
    const newBookingRequest = await prisma.booking.create({
      data: {
        artistId: parsedArtistId,  //  INT not STRING
        organizerId: org.id,
        city,
        price,
        date,
        time,
        category: Array.isArray(artist.category)
          ? artist.category.join(", ")
          : String(artist.category),
        eventName,
      },
    });

    return Response.json(
      {
        message: "Request created successfully",
        newBookingRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return Response.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
