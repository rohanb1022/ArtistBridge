import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma"; //  Proper instantiation

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
      include: {
        bookings: true, //  Gets all bookings related to artist
      },
    });

    if (!artist) {
      return Response.json({ message: "Artist does not exist" }, { status: 400 });
    }

    // Group bookings by status
    const pending = artist.bookings.filter((b: { status: string; }) => b.status === "PENDING");
    const confirmed = artist.bookings.filter((b: { status: string; }) => b.status === "CONFIRMED");
    const cancelled = artist.bookings.filter((b: { status: string; }) => b.status === "CANCELLED");

    const data = {
      pending,
      confirmed,
      cancelled,
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log("Internal Error in artist booking fetch", error);
    return Response.json({ message: "Internal Error", error }, { status: 500 });
  }
}
