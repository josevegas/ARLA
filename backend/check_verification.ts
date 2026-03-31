import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'thecat_18@hotmail.com';
  console.log(`Checking verification codes for: ${email}`);
  
  const codes = await prisma.verificationCode.findMany({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });

  if (codes.length === 0) {
    console.log('No verification codes found for this email.');
  } else {
    console.log('Verification codes found:');
    codes.forEach(c => {
      console.log(`- Code: ${c.code}, Created at: ${c.createdAt}, Expires at: ${c.expiresAt}`);
    });
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    console.log(`User found: ${user.name} ${user.lastName}, Verified: ${user.emailVerified}`);
  } else {
    console.log('User not found in database.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
