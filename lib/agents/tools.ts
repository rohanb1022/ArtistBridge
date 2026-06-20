import { tool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Tool 1: Semantic artist search
export const searchArtistsTool = tool(
  async ({ query, category, city, maxPrice, date }) => {
    try {
      // 1. Embed query if provided
      let embedding: number[] = [];
      if (query) {
        const response = await hf.featureExtraction({
          model: "sentence-transformers/all-MiniLM-L6-v2",
          inputs: query,
        });
        embedding = Array.isArray(response) ? (response as number[]) : [];
      }

      // 2. Query Pinecone
      const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "artistbridge");
      let artistIds: string[] = [];
      
      if (embedding.length > 0) {
        const queryResult = await index.query({
          vector: embedding,
          topK: 10,
          includeMetadata: true,
        });
        if (queryResult.matches) {
          artistIds = queryResult.matches.map((m) => m.id);
        }
      }

      // 3. Query prisma with filters
      const whereClause: any = {};
      if (artistIds.length > 0) {
        whereClause.id = { in: artistIds };
      }
      if (category) {
        // Simple regex or exact match (the current schema uses an array of strings, so has/hasSome depending on prisma version)
        // Adjusting for MongoDB arrays
        whereClause.category = { has: category.toUpperCase() };
      }
      if (city) {
        whereClause.city = { equals: city, mode: 'insensitive' };
      }
      if (maxPrice) {
        whereClause.price = { lte: maxPrice };
      }

      const artists = await prisma.artist.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          city: true,
          category: true,
          price: true,
          bio: true,
          bestEvent: true,
          bookings: {
            where: {
              status: "CONFIRMED",
            },
          },
        },
        take: 10,
      });

      // Filter by date if provided
      const filteredArtists = date
        ? artists.filter((artist) => !artist.bookings.some((b) => b.date === date))
        : artists;

      // Slice the result to top 5 and strip the bookings array
      const finalArtists = filteredArtists.slice(0, 5).map(({ bookings, ...rest }) => rest);

      if (finalArtists.length === 0) {
        return JSON.stringify({ message: "No artists found matching criteria." });
      }

      return JSON.stringify(finalArtists);
    } catch (e) {
      return JSON.stringify({ error: String(e) });
    }
  },
  {
    name: "search_artists",
    description: "Search for artists in the database. Use query for descriptions like 'traditional punjabi folk singer', category for fixed types ('SINGER', 'DANCER', 'DJ', etc.), city for location, maxPrice for budget constraint, and date to check availability.",
    schema: z.object({
      query: z.string().optional().describe("Semantic description of the desired performance or artist"),
      category: z.string().optional().describe("Artist category exactly matched (e.g., 'SINGER', 'DJ')"),
      city: z.string().optional().describe("City name"),
      maxPrice: z.number().optional().describe("Maximum budget/price filter in INR"),
      date: z.string().optional().describe("Date of the event to filter out already booked artists (format YYYY-MM-DD)"),
    }),
  }
);

// Tool 2: Check availability
export const checkArtistAvailabilityTool = tool(
  async ({ artistId, date }) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          artistId,
          date,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      });
      
      if (bookings.length > 0) {
        return `The artist is NOT available on ${date} (already booked).`;
      }
      return `The artist is available on ${date}.`;
    } catch (e) {
      return `Error checking availability: ${e}`;
    }
  },
  {
    name: "check_artist_availability",
    description: "Check if a specific artist is available on a given date.",
    schema: z.object({
      artistId: z.string().describe("The unique MongoDB ID of the artist"),
      date: z.string().describe("The date to check in format YYYY-MM-DD or readable string matching DB"),
    }),
  }
);

// Tool 3: Create Booking Request
export const createBookingRequestTool = tool(
  async ({ artistId, organizerId, eventName, date, time, city, price, category }) => {
    try {
      if (!organizerId) {
        return "Error: Cannot create booking. The organizer ID is missing. Please ask the user to log in again or ensure their ID is passed in the context.";
      }
      
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      });
      if (!artist) {
        return `Error: Artist with ID ${artistId} not found.`;
      }

      const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
      });
      if (!organizer) {
        return `Error: Organizer with ID ${organizerId} not found.`;
      }

      const newBooking = await prisma.booking.create({
        data: {
          artistId,
          organizerId,
          artistName: artist.name,
          organizerName: organizer.name,
          eventName,
          date,
          time,
          city,
          price,
          category: category || artist.category[0] || "GENERAL",
          status: "PENDING",
        },
      });

      return JSON.stringify({ 
        message: "Successfully created the booking request!", 
        bookingId: newBooking.id,
        status: newBooking.status 
      });
    } catch (e) {
      return `Error creating booking: ${e}`;
    }
  },
  {
    name: "create_booking_request",
    description: "Create a booking request for an event. ONLY execute this if the user has explicitly confirmed they want to request/book the artist.",
    schema: z.object({
      artistId: z.string().describe("The unique ID of the artist"),
      organizerId: z.string().describe("The unique ID of the event organizer (comes from context)"),
      eventName: z.string().describe("Name of the event, e.g., 'Wedding Reception'"),
      date: z.string().describe("Date of the event"),
      time: z.string().describe("Timing of the event, e.g., '7:00 PM'"),
      city: z.string().describe("City of the event"),
      price: z.number().describe("Offered price/budget for this booking"),
      category: z.string().optional().describe("Category of the event artist required"),
    }),
  }
);

// Tool 4: Get Artist Pending Bookings (For Option 2 - AI Career Manager)
export const getPendingBookingsTool = tool(
  async ({ artistId }) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          artistId,
          status: "PENDING",
        },
      });
      
      if (bookings.length === 0) {
        return JSON.stringify({ message: "No pending bookings found." });
      }
      return JSON.stringify(bookings);
    } catch (e) {
      return `Error fetching bookings: ${e}`;
    }
  },
  {
    name: "get_pending_bookings",
    description: "Fetch all pending booking requests for an artist to review.",
    schema: z.object({
      artistId: z.string().describe("The unique ID of the artist"),
    }),
  }
);
