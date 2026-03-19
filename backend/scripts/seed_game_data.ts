import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  "Colocación de Trabajadores",
  "Gestión de Recursos",
  "Construcción de Mazos",
  "Deducción Social",
  "Subastas / Pujas",
  "Faroleo",
  "Velocidad / Reflejos",
  "Gestión de Mano",
  "Suerte/Azar",
  "Toma de Roles",
  "Fantasía",
  "Ciencia Ficción",
  "Terror / Zombis",
  "Histórico / Educativo",
  "Misterio / Crimen",
  "Fiesta",
  "Cooperativo",
  "Estrategia",
  "Abstracto",
  "Habilidad / Destreza",
  "Cartas",
  "Juego de Rol",
  "Familiar"
];

const difficulties = ["Fácil", "Medio", "Difícil"];

async function main() {
  console.log("Seeding categories...");
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seeding difficulties...");
  for (const name of difficulties) {
    await prisma.difficulty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  
  console.log("Seed complete! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
