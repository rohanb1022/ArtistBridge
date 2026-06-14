const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Testing database connection...");
  const artists = await prisma.artist.findMany({ take: 3 });
  console.log("Found artists:", artists.map(a => ({ id: a.id, name: a.name, category: a.category })));
  
  const organizers = await prisma.organizer.findMany({ take: 3 });
  console.log("Found organizers:", organizers.map(o => ({ id: o.id, name: o.name })));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
