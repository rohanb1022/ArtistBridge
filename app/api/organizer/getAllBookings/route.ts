import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const client = await withAuth(req);
  if (!client || client.role !== "organizer") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const organizer = await prisma.organizer.findUnique({
      where: { id: client.id },
      include: {
        bookings: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!organizer) {
      return Response.json({ message: "Organizer not found" }, { status: 400 });
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

    // Auto-update expired pending requests
    const expiredPendingIds: string[] = [];
    const pending = organizer.bookings.filter((b) => {
      if (b.status !== "PENDING") return false;
      if (isExpired(b.expiryDate, b.date, b.time)) {
        expiredPendingIds.push(b.id);
        return false;
      }
      return true;
    });

    if (expiredPendingIds.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: expiredPendingIds } },
        data: { status: "EXPIRED" },
      });
    }

    const confirmed = organizer.bookings.filter((b) => b.status === "CONFIRMED");

    // Include cancelled, rejected, and expired requests so organizer knows to book someone else
    const cancelled = organizer.bookings
      .filter((b) => 
        b.status === "CANCELLED" || 
        b.status === "REJECTED" || 
        b.status === "EXPIRED" || 
        (b.status === "PENDING" && isExpired(b.expiryDate, b.date, b.time))
      )
      .map((b) => ({
        ...b,
        status: b.status === "PENDING" && isExpired(b.expiryDate, b.date, b.time) ? "EXPIRED" : b.status,
      }));

    const data = {
      pending,
      confirmed,
      cancelled,
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in getAllBookings (organizer):", error);
    return Response.json(
      { message: "Internal error while fetching organizer bookings", error },
      { status: 500 }
    );
  }
}
