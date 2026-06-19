"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";

export async function getStatusMetrics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (email !== "007harshit.mathur.24@gmail.com") {
    throw new Error("Access denied: Admin only.");
  }

  // Determine if DB is healthy and measure latency
  let dbLatency = -1;
  let dbStatus = "healthy";
  let dbError = null;

  try {
    const startDb = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startDb;
  } catch (err) {
    dbStatus = "unhealthy";
    dbError = err?.message || String(err);
  }

  // Determine if Gemini is configured and measure latency
  let aiLatency = -1;
  let aiStatus = "healthy";
  let aiError = null;

  try {
    const model = getGeminiModel();
    if (!model) {
      aiStatus = "inactive";
      aiError = "Gemini API key is not configured in environment variables.";
    } else {
      const startAi = Date.now();
      const result = await model.generateContent("Respond with only the word 'pong'");
      
      // Attempt to inspect response to verify it generated content correctly
      if (result && result.response) {
        await result.response.text();
      }
      
      aiLatency = Date.now() - startAi;
    }
  } catch (err) {
    aiStatus = "unhealthy";
    aiError = err?.message || String(err);
  }

  return {
    db: {
      status: dbStatus,
      latency: dbLatency,
      error: dbError,
    },
    gemini: {
      status: aiStatus,
      latency: aiLatency,
      error: aiError,
    },
  };
}
