"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const ADMIN_EMAIL = "007harshit.mathur.24@gmail.com";

export async function getAdminAnalytics() {
  try {
    const user = await currentUser();
    if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
      throw new Error("Unauthorized Access. Admin only.");
    }

    const totalUsers = await db.user.count();
    const proUsers = await db.user.count({ where: { tier: "PRO" } });
    const totalResumes = await db.resume.count();
    const totalPayments = await db.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true }
    });

    // Get users joined per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await db.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    });

    // Group by date
    const userGrowth = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      userGrowth[dateStr] = 0;
    }

    recentUsers.forEach(u => {
      const dateStr = u.createdAt.toISOString().split('T')[0];
      if (userGrowth[dateStr] !== undefined) {
        userGrowth[dateStr]++;
      }
    });

    const chartData = Object.keys(userGrowth).map(date => ({
      date,
      users: userGrowth[date]
    }));

    return {
      totalUsers,
      proUsers,
      totalResumes,
      totalRevenue: (totalPayments._sum.amount || 0) / 100, // Amount is in paise, convert to INR
      chartData
    };
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    throw new Error(error.message);
  }
}

export async function getStatusMetrics() {
  try {
    const user = await currentUser();
    if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
      throw new Error("Unauthorized Access.");
    }

    // 1. Check DB Latency
    const dbStart = Date.now();
    let dbStatus = "healthy";
    let dbError = null;
    try {
      await db.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = "error";
      dbError = e.message;
    }
    const dbLatency = Date.now() - dbStart;

    // 2. Check Gemini Latency
    const geminiStart = Date.now();
    let geminiStatus = "healthy";
    let geminiError = null;
    
    if (!process.env.GEMINI_API_KEY) {
      geminiStatus = "inactive";
      geminiError = "GEMINI_API_KEY not set";
    } else {
      try {
        const { getGeminiModel } = await import("@/lib/gemini");
        const model = getGeminiModel();
        if (!model) throw new Error("Failed to initialize model");
        // Super short prompt for ping
        await model.generateContent("Ping. Reply with exactly 'Pong'.");
      } catch (e) {
        geminiStatus = "error";
        geminiError = e.message;
      }
    }
    const geminiLatency = Date.now() - geminiStart;

    return {
      db: { latency: dbLatency, status: dbStatus, error: dbError },
      gemini: { latency: geminiLatency, status: geminiStatus, error: geminiError }
    };
  } catch (error) {
    console.error("Status Metrics Error:", error);
    throw new Error(error.message);
  }
}
