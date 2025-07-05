import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware"; // Ensures only logged-in users can send requests

export async function POST(req: Request) {
  const user = await withAuth(req);

  if (!user || user.role !== "organizer") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      name,
      email,
      city,
      category,
      maxBudget,
      date,
      timing,
    } = await req.json();

    // Validate all required fields
    if (!name || !city || !category || !maxBudget || !date || !timing || !email) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    //  Check if the organizer with this email exists
    const existingOrganizer = await prisma.organizer.findUnique({
      where: { email },
    });

    if (!existingOrganizer) {
      return Response.json(
        { message: "Organizer email does not exist in the system" },
        { status: 404 }
      );
    }

    //  Proceed to create the request
    const request = await prisma.artistRequest.create({
      data: {
        organizerId: user.id,
        name,
        email,
        city,
        category,
        maxBudget,
        date,
        timing,
      },
    });

    return Response.json(
      { message: "Request sent successfully", data: request },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending request:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
