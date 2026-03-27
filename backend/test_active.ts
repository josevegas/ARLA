import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'cmn3nhxl400007eu92zp68063'; // User from check_db.ts
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  console.log(`Searching for UserId: ${userId}`);
  console.log(`Today (UTC Midnight): ${today.toISOString()}`);

  const reservations = await prisma.reservation.findMany({
    where: {
      userId,
      date: { gte: today },
      status: { not: 'CANCELLED' }
    },
    orderBy: { date: 'asc' },
    include: {
      table: true,
      games: true
    }
  });

  console.log("=== RESULTS ===");
  console.log(JSON.stringify(reservations, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
