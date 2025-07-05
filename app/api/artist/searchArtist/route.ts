import prisma from "@/lib/prisma";
import { ArtistCategory } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const category = searchParams.get("category");

  if (!city || !category) {
    return Response.json(
      { message: "City and category are required" },
      { status: 400 }
    );
  }

  // Optional: Validate category
  if (!Object.values(ArtistCategory).includes(category as ArtistCategory)) {
    return Response.json({ message: "Invalid category" }, { status: 400 });
  }

  try {
    console.log("city:", city, "category:", category.toUpperCase());
    const artists = await prisma.artist.findMany({
      where: {
        city: {
          equals: city,
          mode: "insensitive",
        },
        category: {
          has: category.toUpperCase() as ArtistCategory,
        },
      },
    });
    console.log(artists)
    return Response.json({ data: artists }, { status: 200 });

  } catch (error) {
    console.error("Error fetching artists:", error);
    return Response.json(
      { message: "Error fetching artists" },
      { status: 500 }
    );
  }
}
