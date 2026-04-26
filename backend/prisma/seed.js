import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.cooperative.deleteMany();
  await prisma.container.deleteMany();

  // Keep IDs stable for demos (containerId=1 works after every seed run).
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'Container'");
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'Cooperative'");

  await prisma.container.createMany({
    data: [
      {
        containerNumber: "MSCU-1000001",
        destinationPort: "Rotterdam",
        maxWeight: 28000,
        maxVolume: 67,
        probabilityEmpty: 0.94,
        status: "AT_NADOR_WEST_MED",
      },
      {
        containerNumber: "MSCU-1000002",
        destinationPort: "Antwerp",
        maxWeight: 30000,
        maxVolume: 70,
        probabilityEmpty: 0.81,
        status: "AT_NADOR_WEST_MED",
      },
      {
        containerNumber: "MSCU-1000003",
        destinationPort: "Valencia",
        maxWeight: 26000,
        maxVolume: 62,
        probabilityEmpty: 0.69,
        status: "IN_TRANSIT",
      }
    ],
  });

  await prisma.cooperative.createMany({
    data: [
      {
        name: "Agri Atlas Cooperative",
        productType: "Argan oil boxes",
        availableWeight: 5500,
        availableVolume: 12,
        phone: "+212600000001",
      },
      {
        name: "Rif Citrus Group",
        productType: "Citrus pallets",
        availableWeight: 8900,
        availableVolume: 18,
        phone: "+212600000002",
      },
      {
        name: "Souss Herbs Cooperative",
        productType: "Dried herbs",
        availableWeight: 3200,
        availableVolume: 10,
        phone: "+212600000003",
      },
      {
        name: "Draa Dates Federation",
        productType: "Date cartons",
        availableWeight: 7600,
        availableVolume: 15,
        phone: "+212600000004",
      },
      {
        name: "Oriental Olive Collective",
        productType: "Olive oil drums",
        availableWeight: 11200,
        availableVolume: 20,
        phone: "+212600000005",
      }
    ],
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
