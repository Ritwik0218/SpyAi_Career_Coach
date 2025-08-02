// Quick test to verify system components
require('dotenv').config();

console.log('Testing system components...\n');

// Test environment variables
console.log('Environment Variables:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
console.log('- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing');
console.log('- CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Missing');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Missing');
console.log('- INNGEST_EVENT_KEY:', process.env.INNGEST_EVENT_KEY ? 'Set' : 'Missing');
console.log('- INNGEST_SIGNING_KEY:', process.env.INNGEST_SIGNING_KEY ? 'Set' : 'Missing');

// Test Gemini API
async function testGemini() {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Test API connection');
    console.log('\n✅ Gemini API connection successful');
  } catch (error) {
    console.log('\n⚠️ Gemini API error (fallback will work):', error.message);
  }
}

// Test Prisma connection
async function testPrisma() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Prisma database connection successful');
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Prisma database error:', error.message);
  }
}

// Run tests
(async () => {
  await testGemini();
  await testPrisma();
  console.log('\nTest complete!');
})();
