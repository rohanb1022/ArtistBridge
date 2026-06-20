import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json({ message: "requestId is required" }, { status: 400 });
  }

  try {
    // 1. Fetch the request details
    const eventRequest = await prisma.artistRequest.findUnique({
      where: { id: requestId },
    });

    if (!eventRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // 2. Fetch all artists who match the request's category
    const matchingArtists = await prisma.artist.findMany({
      where: {
        category: {
          has: eventRequest.category.toUpperCase(), // Match category exactly (stored in uppercase)
        },
      },
      include: {
        bookings: true,
      },
    });

    // Filter out artists who are already CONFIRMED on the requested date
    const availableArtists = matchingArtists.filter((artist) => {
      const isBooked = artist.bookings.some(
        (b) => b.status === "CONFIRMED" && b.date === eventRequest.date
      );
      return !isBooked;
    });

    // 3. Score each artist based on matching heuristics
    const recommendations = availableArtists.map((artist) => {
      let score = 100; // Base score for matching category
      const tags: string[] = [];

      // A. Location Match
      const requestCity = eventRequest.city.trim().toLowerCase();
      const artistCity = artist.city?.trim().toLowerCase() || "";
      if (artistCity && (artistCity.includes(requestCity) || requestCity.includes(artistCity))) {
        score += 50;
        tags.push("📍 Local Artist");
      }

      // B. Budget compatibility
      if (artist.price) {
        if (artist.price <= eventRequest.maxBudget) {
          score += 30;
          tags.push("💰 Within Budget");
        } else if (artist.price <= eventRequest.maxBudget * 1.25) {
          score += 10;
          tags.push("🤝 Negotiable Price");
        } else {
          score -= 20;
          tags.push("⚠️ Over Budget");
        }
      } else {
        // Assume fits if no price configured
        score += 15;
      }

      // C. Booking popularity
      const confirmedBookings = artist.bookings.filter(b => b.status === "CONFIRMED").length;
      if (confirmedBookings > 0) {
        const popularityBonus = Math.min(confirmedBookings * 5, 20);
        score += popularityBonus;
        tags.push("🔥 Highly Booked");
      }

      // D. Profile Completeness
      if (artist.bio && artist.bestEvent) {
        score += 10;
      }

      return {
        id: artist.id,
        name: artist.name,
        city: artist.city || "Unknown",
        category: artist.category,
        price: artist.price || 0,
        bio: artist.bio || "",
        bestEvent: artist.bestEvent || "",
        score,
        tags,
      };
    });

    // 4. Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    // Max potential score is ~210. Map it to a clean percentage matching score
    const normalizedRecommendations = recommendations.map(rec => {
      const matchPercentage = Math.min(Math.round((rec.score / 185) * 100), 100);
      return {
        id: rec.id,
        name: rec.name,
        city: rec.city,
        category: rec.category,
        price: rec.price,
        bio: rec.bio,
        bestEvent: rec.bestEvent,
        matchPercentage,
        tags: rec.tags,
      };
    });

    return NextResponse.json({ data: normalizedRecommendations }, { status: 200 });

  } catch (error) {
    console.error("Error recommending artists:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
