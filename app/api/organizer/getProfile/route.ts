import { withAuth } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient();

export async function GET(req: Request) {
  try {
    const client = await withAuth(req);
    if (!client || client.role !== "organizer") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const org = await prisma.organizer.findUnique({
      where: { id: client.id }, // where query use to find the id in the db
      include: {   // prisma bydefault does not include relations so we have to tell him
        artistRequests: true, // externally to include these two as well
        booking: true,
      },
    });
    if (!org) {
      return Response.json(
        { message: "Organization in not found please try to login again" },
        { status: 400 }
      );
    }

    const data = {
      name: org.name,
      email: org.email,
      city: org.city,
      artistRequests: org.artistRequests,
      bookings: org.booking,
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log("error in getProfile in organization", error);
    return Response.json(
      { message: "Some Error in getProfile of org" },
      { status: 500 }
    );
  }
}
