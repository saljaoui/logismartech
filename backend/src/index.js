import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  await prisma.$connect();

  const server = app.listen(port, () => {
    console.log(`LogiSmartech backend running on http://localhost:${port}`);
  });

  const shutdown = async () => {
    console.log("Shutting down gracefully...");
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch(async (error) => {
  console.error("Failed to start backend:", error);
  await prisma.$disconnect();
  process.exit(1);
});
