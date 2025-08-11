import { PrismaClient, PlanType } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Free user
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@example.com' },
    update: {},
    create: {
      email: 'free@example.com',
      password: hashedPassword,
      name: 'Free User',
      plan: PlanType.FREE,
      isEmailVerified: true,
    },
  });

  console.log('Created free user:', freeUser.email);

  // Pro user
  const proUser = await prisma.user.upsert({
    where: { email: 'pro@example.com' },
    update: {},
    create: {
      email: 'pro@example.com',
      password: hashedPassword,
      name: 'Pro User',
      plan: PlanType.PRO,
      isEmailVerified: true,
      stripeCustomerId: 'cus_test_pro_user',
      subscriptionId: 'sub_test_pro_user',
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log('Created pro user:', proUser.email);

  console.log('✅ Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });