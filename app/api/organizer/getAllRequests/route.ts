import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await withAuth(req);

  // 1. Authorization check
  if (!user || user.role !== "organizer") {
    return Response.json({ message: "Unauthorized access" }, { status: 401 });
  }

  try {
    // 2. Fetch all requests by this organizer
    const requests = await prisma.artistRequest.findMany({
      where: { organizerId: user.id },
      orderBy: { createdAt: "desc" }, // recent first (optional)
    });

    // 3. Send response
    return Response.json({ requests }, { status: 200 });

  } catch (error) {
    console.error("Error fetching organizer's requests:", error);
    return Response.json(
      { message: "Internal server error while fetching requests" },
      { status: 500 }
    );
  }
}
