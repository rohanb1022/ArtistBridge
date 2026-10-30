import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await withAuth(req);
  if (!user || user.role !== "artist") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { id: user.id },
      include: {
        bookings: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!artist) {
      return Response.json({ message: "Artist not found" }, { status: 404 });
    }

    const now = new Date();

    const isDatePassed = (dateStr: string, timeStr?: string) => {
      if (!dateStr) return false;
      try {
        if (timeStr && timeStr.includes(":")) {
          const dt = new Date(`${dateStr}T${timeStr}`);
          if (!isNaN(dt.getTime())) return dt < now;
        }
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          d.setHours(23, 59, 59, 999);
          return d < now;
        }
      } catch {
        return false;
      }
      return false;
    };

    const isExpired = (expiryDate?: string | null, dateStr?: string, timeStr?: string) => {
      if (expiryDate) {
        const exp = new Date(expiryDate);
        if (!isNaN(exp.getTime())) {
          exp.setHours(23, 59, 59, 999);
          if (exp < now) return true;
        }
      }
      return isDatePassed(dateStr || "", timeStr);
    };

    // 1. Performed Events:
    // Confirmed bookings where event date has passed
    const performed = artist.bookings
      .filter((b) => b.status === "CONFIRMED" && isDatePassed(b.date, b.time))
      .map((b) => ({
        ...b,
        historyType: "PERFORMED" as const,
        historyBadge: "Show Completed",
        historyDescription: "Successfully accepted and performed this event.",
      }));

    // 2. Missed Events:
    // Bookings that were missed (never accepted and deadline/event passed), expired, or cancelled/rejected
    const missed = artist.bookings
      .filter((b) => {
        if (b.status === "EXPIRED") return true;
        if (b.status === "PENDING" && isExpired(b.expiryDate, b.date, b.time)) return true;
        if ((b.status === "CANCELLED" || b.status === "REJECTED") && isDatePassed(b.date, b.time)) return true;
        return false;
      })
      .map((b) => {
        let reason = "Missed (Request not accepted before event date passed)";
        let badge = "Missed";

        if (b.status === "EXPIRED" || (b.expiryDate && isExpired(b.expiryDate))) {
          badge = "Expired Deadline";
          reason = b.expiryDate
            ? `Expired (Artist did not accept before deadline of ${b.expiryDate})`
            : "Expired (Acceptance deadline passed)";
        } else if (b.status === "CANCELLED" || b.status === "REJECTED") {
          badge = "Declined";
          reason = "Request was declined or cancelled.";
        }

        return {
          ...b,
          historyType: "MISSED" as const,
          historyBadge: badge,
          historyDescription: reason,
        };
      });

    // Summary Statistics
    const totalEarnings = performed.reduce((sum, b) => sum + (b.price || 0), 0);
    const totalHistory = performed.length + missed.length;
    const acceptanceRate =
      totalHistory > 0 ? Math.round((performed.length / totalHistory) * 100) : 100;

    const stats = {
      totalPerformed: performed.length,
      totalMissed: missed.length,
      totalEarnings,
      acceptanceRate,
    };

    const all = [...performed, ...missed].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return Response.json(
      {
        success: true,
        data: {
          performed,
          missed,
          all,
          stats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getEventHistory:", error);
    return Response.json({ message: "Internal server error", error }, { status: 500 });
  }
}

