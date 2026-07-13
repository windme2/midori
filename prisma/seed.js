const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.session.deleteMany();
  await prisma.depositRequest.deleteMany();
  await prisma.transactionLog.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = hashPassword("1234");

  // Create members (user01 - user04)
  const user01Date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const user01 = await prisma.user.create({
    data: {
      username: "user01",
      passwordHash,
      name: "User One",
      role: "member",
      tier: "Bronze",
      memberSince: "July 2026",
      location: "Bangna, Bangkok",
      points: 120,
      recycledKg: 4.0,
      co2SavedKg: 2.88,
      plasticKg: 4.0,
      hasCompletedOnboarding: false,
      weeklyPointGoal: 2000,
      createdAt: user01Date,
    },
  });
  console.log("Created user: user01 (10 days old)");

  // Seed transaction log in last week (8 days ago)
  const logDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  await prisma.transactionLog.create({
    data: {
      id: "TX-SEED-120",
      userId: user01.id,
      title: "Deposit Plastic (4.0 kg)",
      date: "8 days ago",
      points: "+120",
      positive: true,
      pending: false,
      wasteType: "Plastic",
      weight: 4.0,
      station: "Bangna",
      createdAt: logDate,
    },
  });
  console.log("Created user01 past transaction log (+120 points)");

  const users = [
    { username: "user02", name: "User Two", role: "member", tier: "Bronze" },
    { username: "user03", name: "User Three", role: "member", tier: "Bronze" },
    { username: "user04", name: "User Four", role: "member", tier: "Bronze" },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        username: u.username,
        passwordHash,
        name: u.name,
        role: u.role,
        tier: u.tier,
        memberSince: "July 2026",
        location: "Bangna, Bangkok",
        points: 0,
        recycledKg: 0.0,
        co2SavedKg: 0.0,
        hasCompletedOnboarding: false,
        weeklyPointGoal: 2000,
      },
    });
    console.log(`Created user: ${u.username}`);
  }

  // Create admin user
  await prisma.user.create({
    data: {
      username: "admin",
      passwordHash,
      name: "WIND",
      role: "admin",
      tier: "Admin",
      memberSince: "July 2026",
      location: "Bangna, Bangkok",
      points: 0,
      recycledKg: 0.0,
      co2SavedKg: 0.0,
      hasCompletedOnboarding: true,
    },
  });
  console.log("Created admin user: admin");

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
