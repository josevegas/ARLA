import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@arla.com';
  const password = 'Jlvm2612@';
  
  console.log(`Iniciando creación de SuperAdmin: ${email}`);
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin ARLA',
      role: 'SUPERADMIN',
    },
  });

  console.log('SuperAdmin creado/actualizado con éxito:', superAdmin.email);
}

main()
  .catch((e) => {
    console.error('Error al crear SuperAdmin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
