import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tableCount = await prisma.table.count();
  if (tableCount === 0) {
    console.log('Seeding tables...');
    await prisma.table.createMany({
      data: [
        { capacity: 4, description: 'Mesa Salón Ventana' },
        { capacity: 4, description: 'Mesa Terraza Exterior' },
        { capacity: 8, description: 'Mesa Grande Salón' },
        { capacity: 8, description: 'Mesa Grande Terraza' },
      ],
    });
    console.log('Tables seeded successfully.');
  } else {
    console.log('Tables already exist.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
