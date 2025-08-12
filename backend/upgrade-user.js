const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function upgradeUser() {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Current user plan:', user.plan);

    // Upgrade to Pro
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: {
        plan: 'PRO',
        subscriptionStatus: 'active',
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    console.log('✅ User upgraded to Pro plan!');
    console.log('New plan:', updatedUser.plan);
    console.log('Subscription status:', updatedUser.subscriptionStatus);
    console.log('Subscription end date:', updatedUser.subscriptionEndDate);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

upgradeUser();