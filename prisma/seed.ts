import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user: Prisma.UserCreateInput = {
    username: 'nathan',
    email: 'nathan@admin.com',
    password: 'nathan',
    roles: [Role.ADMIN],
    createdBy: 'nathan',
    updatedBy: 'nathan',
  };

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  const nathan = await prisma.user.upsert({
    where: { username: user.username },
    update: user,
    create: user,
  });
  console.log({ nathan });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
