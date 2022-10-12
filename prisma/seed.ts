import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user: Prisma.UserCreateInput = {
    name: 'Nathan',
    email: 'nathan@admin.com',
    password: 'admin',
    roles: [Role.ADMIN],
  };

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  const nathan = await prisma.user.upsert({
    where: { email: user.email },
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
