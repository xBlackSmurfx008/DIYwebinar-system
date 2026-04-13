const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.organization.upsert({
    where: { id: "demo-org" },
    create: {
      id: "demo-org",
      name: "Demo organization",
      slug: "demo-org",
    },
    update: {},
  });

  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    create: {
      email: "admin@example.com",
      passwordHash: adminHash,
      name: "Admin",
      role: "ADMIN",
    },
    update: {},
  });

  const speakerHash = await bcrypt.hash("speaker123", 10);
  await prisma.user.upsert({
    where: { email: "speaker@example.com" },
    create: {
      email: "speaker@example.com",
      passwordHash: speakerHash,
      name: "Speaker",
      role: "SPEAKER",
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
