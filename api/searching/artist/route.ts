import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const budget = searchParams.get("budget"); // expected as number string

  if (!city && !category && !budget) {
    return Response.json({ message: "At least one filter is required" }, { status: 400 });
  }

  try {
    const artists = await prisma.artist.findMany({
      where: {
        AND: [
          city ? { city: { equals: city, mode: "insensitive" } } : {},
          category ? { category: { equals: category, mode: "insensitive" } } : {},
          budget ? {
            priceRange: {
              lte: budget, // optional logic: parseInt(budget)
            },
          } : {},
        ],
      },
    });

    return Response.json({ data: artists }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal error", error }, { status: 500 });
  }
}
