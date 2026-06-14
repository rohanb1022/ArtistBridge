const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Simulating booking insert...");
  
  const artistId = "6a0de501b24aa7067a81e8a8";
  const organizerId = "6a0df096121c54dc24e1db1b";
  
  const artist = await prisma.artist.findUnique({ where: { id: artistId } });
  const org = await prisma.organizer.findUnique({ where: { id: organizerId } });
  
  if (!artist || !org) {
    console.error("Artist or Organizer not found in DB");
    return;
  }
  
  const newBookingRequest = await prisma.booking.create({
    data: {
      artistId: artist.id,
      organizerId: org.id,
      organizerName: org.name,
      artistName: artist.name,
      city: "Mumbai",
      price: 15000,
      date: "2026-07-20",
      time: "18:00",
      category: Array.isArray(artist.category)
        ? artist.category.join(", ")
        : String(artist.category),
      eventName: "Test Festival",
    },
  });
  
  console.log("Successfully created test booking:", newBookingRequest);
  
  // Clean up test insert
  console.log("Cleaning up test booking...");
  await prisma.booking.delete({ where: { id: newBookingRequest.id } });
  console.log("Cleanup finished.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
