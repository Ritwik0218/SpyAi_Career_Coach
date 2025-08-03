import { db } from "@/lib/prisma";

export async function checkDatabaseHealth() {
  try {
    // Simple query to check if database is responsive
    await db.$queryRaw`SELECT 1`;
    return { healthy: true, error: null };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message,
      isConnectionError: error.code === 'P1001'
    };
  }
}

export async function waitForDatabase(maxAttempts = 3, delay = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const health = await checkDatabaseHealth();
    
    if (health.healthy) {
      return { success: true, attempts: attempt };
    }
    
    if (attempt < maxAttempts) {
      console.log(`Database connection attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return { success: false, attempts: maxAttempts };
}
