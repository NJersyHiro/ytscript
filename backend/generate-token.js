const jwt = require('jsonwebtoken');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function generateToken() {
  try {
    // Find the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      email: user.email,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus
    });

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
      plan: user.plan
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    console.log('\n=== JWT TOKEN ===');
    console.log(token);
    console.log('\n=== COPY THIS TO BROWSER STORAGE ===');
    console.log(`localStorage.setItem('auth-token', '${token}');`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateToken();