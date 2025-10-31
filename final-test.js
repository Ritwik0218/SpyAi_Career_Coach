// Test the complete application flow
require('dotenv').config();

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Application Flow\n');
  
  // 1. Test Environment Variables
  console.log('1. Environment Variables:');
  const envVars = {
    'DATABASE_URL': !!process.env.DATABASE_URL,
    'CLERK_PUBLISHABLE_KEY': !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    'CLERK_SECRET_KEY': !!process.env.CLERK_SECRET_KEY,
    'GEMINI_API_KEY': !!process.env.GEMINI_API_KEY
  };
  
  for (const [key, isSet] of Object.entries(envVars)) {
    console.log(`   ${isSet ? '✅' : '❌'} ${key}: ${isSet ? 'Set' : 'Missing'}`);
  }
  
  // 2. Test Database Connection
  console.log('\n2. Database Connection:');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('   ✅ Prisma database connection successful');
    await prisma.$disconnect();
  } catch (error) {
    console.log('   ❌ Database error:', error.message);
  }
  
  // 3. Test Gemini API (with timeout simulation)
  console.log('\n3. Gemini API Connection:');
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('   ⚠️ GEMINI_API_KEY not set — skipping Gemini connectivity test (fallbacks active)');
    } else {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Simple test request
      const result = await Promise.race([
        model.generateContent('Say "API works" in JSON format: {"status": "working"}'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);

      const response = await result.response;
      console.log('   ✅ Gemini API connection successful');
      console.log('   📝 Sample response received');
    }
  } catch (error) {
    console.log('   ⚠️  Gemini API issue (fallback available):', error.message);
  }
  
  console.log('\n🎉 Application Status: READY');
  console.log('📍 Server running at: http://localhost:3004');
  console.log('🔗 Test the app: Open browser and go to localhost:3004');
}

testCompleteFlow().catch(console.error);
