import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = 'superadmin@arla.com';
  const password = 'Jlvm2612@';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPERADMIN',
        name: 'Super',
        lastName: 'Admin'
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN'
      }
    });

    console.log('SuperAdmin created/updated successfully:', user.email);
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
