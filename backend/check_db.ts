import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ 
    include: { 
      reservations: {
        include: { table: true }
      } 
    } 
  });
  console.log("=== USERS & RESERVATIONS ===");
  users.forEach(u => {
    console.log(`User: ${u.email} (${u.id})`);
    u.reservations.forEach(r => {
      console.log(`  Reserva: ${r.date.toISOString()} @ ${r.time} Status: ${r.status}`);
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
