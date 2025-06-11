import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      email: 'test1@example.com',
      name: 'Test User 1',
      password: 'password123',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      email: 'test2@example.com',
      name: 'Test User 2',
      password: 'password123',
      role: 'ADMIN',
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
