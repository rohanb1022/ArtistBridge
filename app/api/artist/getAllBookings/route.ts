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
      return Response.json({ message: "Artist does not exist" }, { status: 400 });
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

    // Auto-update any expired pending requests in the background
    const expiredPendingIds: string[] = [];
    const activePending = artist.bookings.filter((b) => {
      if (b.status !== "PENDING") return false;
      if (isExpired(b.expiryDate, b.date, b.time)) {
        expiredPendingIds.push(b.id);
        return false; // Moved out of active pending -> to history
      }
      return true;
    });

    if (expiredPendingIds.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: expiredPendingIds } },
        data: { status: "EXPIRED" },
      });
    }

    // Active upcoming confirmed bookings (event date is today or in the future)
    const activeConfirmed = artist.bookings.filter((b) => {
      if (b.status !== "CONFIRMED") return false;
      return !isDatePassed(b.date, b.time); // Moves to history once date is gone
    });

    // Cancelled bookings
    const cancelled = artist.bookings.filter(
      (b) => b.status === "CANCELLED" || b.status === "REJECTED"
    );

    // Calculate historical counts
    const performedCount = artist.bookings.filter(
      (b) => b.status === "CONFIRMED" && isDatePassed(b.date, b.time)
    ).length;

    const missedCount = artist.bookings.filter((b) => {
      if (b.status === "EXPIRED") return true;
      if (b.status === "PENDING" && isExpired(b.expiryDate, b.date, b.time)) return true;
      if ((b.status === "CANCELLED" || b.status === "REJECTED") && isDatePassed(b.date, b.time)) return true;
      return false;
    }).length;

    const data = {
      pending: activePending,
      confirmed: activeConfirmed,
      cancelled,
      historyCount: {
        performed: performedCount,
        missed: missedCount,
        total: performedCount + missedCount,
      },
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Internal Error in artist booking fetch", error);
    return Response.json({ message: "Internal Error", error }, { status: 500 });
  }
}
