import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch artist details
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
    });

    if (!artist) {
      return NextResponse.json({ message: "Artist profile not found" }, { status: 404 });
    }

    // 2. Fetch all pending artist requests that match the artist's category list
    const pendingRequests = await prisma.artistRequest.findMany({
      where: {
        category: {
          in: artist.category,
        },
        status: "PENDING",
      },
    });

    // 3. Score each request
    const recommendations = pendingRequests.map((eventRequest) => {
      let score = 100; // Base score
      const tags: string[] = [];

      // A. Location Match
      const requestCity = eventRequest.city.trim().toLowerCase();
      const artistCity = artist.city?.trim().toLowerCase() || "";
      if (artistCity && (artistCity.includes(requestCity) || requestCity.includes(artistCity))) {
        score += 50;
        tags.push("📍 Local Gig");
      }

      // B. Budget match
      if (artist.price) {
        if (eventRequest.maxBudget >= artist.price) {
          score += 30;
          tags.push("💰 Budget Matches Your Rate");
        } else if (eventRequest.maxBudget >= artist.price * 0.75) {
          score += 10;
          tags.push("🤝 Negotiable Budget");
        } else {
          score -= 20;
          tags.push("⚠️ Low Budget");
        }
      } else {
        score += 15;
      }

      // C. Freshness (Created recently)
      const ageInMs = Date.now() - new Date(eventRequest.createdAt).getTime();
      const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
      if (ageInDays <= 2) {
        score += 10;
        tags.push("✨ New Event");
      }

      return {
        id: eventRequest.id,
        name: eventRequest.name,
        email: eventRequest.email,
        city: eventRequest.city,
        category: eventRequest.category,
        maxBudget: eventRequest.maxBudget,
        date: eventRequest.date,
        timing: eventRequest.timing,
        status: eventRequest.status,
        score,
        tags,
      };
    });

    // 4. Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    // Normalize score to percentage (max possible score is around 180)
    const normalizedRecommendations = recommendations.map(rec => {
      const matchPercentage = Math.min(Math.round((rec.score / 180) * 100), 100);
      return {
        id: rec.id,
        name: rec.name,
        email: rec.email,
        city: rec.city,
        category: rec.category,
        maxBudget: rec.maxBudget,
        date: rec.date,
        timing: rec.timing,
        status: rec.status,
        matchPercentage,
        tags: rec.tags,
      };
    });

    return NextResponse.json({ data: normalizedRecommendations }, { status: 200 });

  } catch (error) {
    console.error("Error recommending events for artist:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
