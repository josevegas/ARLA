import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@arla.com';
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true }
  });
  console.log('User verified:', user.email, user.emailVerified);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
