// Quick test to check database connection and user operations
import { db } from './lib/prisma.js';

async function testDatabase() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const result = await db.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
    
    // Check if any users exist
    const userCount = await db.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    // List existing users (if any)
    if (userCount > 0) {
      const users = await db.user.findMany({
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          email: true,
          createdAt: true
        }
      });
      console.log('👥 Existing users:', users);
    }
    
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await db.$disconnect();
  }
}

testDatabase();
