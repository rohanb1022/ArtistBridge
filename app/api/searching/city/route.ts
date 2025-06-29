import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return Response.json({ message: "City is required" }, { status: 400 });
  }

  try {
    const artists = await prisma.artist.findMany({
      where: {
        city: {
          equals: city,
          mode: "insensitive", // case-insensitive match
        },
      },
    });

    return Response.json({ data: artists }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal error", error }, { status: 500 });
  }
}
