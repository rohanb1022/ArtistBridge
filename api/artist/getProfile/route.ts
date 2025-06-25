import { withAuth } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient();

export async function GET(req: Request) {
  try {
    const user = await withAuth(req); // we pass the req object because our req contains that token and method and related info.
    if (!user || user.role !== "artist") {
      return Response.json({message : "Unauthorized"} , { status : 401 });
    }

    const artist = await prisma.artist.findUnique({ where: { id: user.id } });

    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 400 });
    }

    const data = {
      name: artist.name,
      email: artist.email,
      city: artist.city,
      category: artist.category,
      bio: artist.bio,
      priceRange: artist.priceRange,
    };

    return Response.json({ data });
  } catch (error) {
    console.log("error occurred while fetching artist profile", error);
    return Response.json(
      { message: " Internal server error at artist profile fetching " + error },
      { status: 500 }
    );
  }
}
