import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.organization.upsert({
    where: { id: "demo-org" },
    create: {
      id: "demo-org",
      name: "Demo Organization",
      slug: "demo",
    },
    update: {},
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
