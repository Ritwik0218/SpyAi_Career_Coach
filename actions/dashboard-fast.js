"use server";

import { auth } from "@clerk/nextjs/server";

// Fast fallback data for dashboard
const getDefaultInsights = () => ({
  salaryRanges: [
    { level: "Entry", range: "$50k - $70k" },
    { level: "Mid", range: "$70k - $100k" }, 
    { level: "Senior", range: "$100k - $150k" },
    { level: "Lead", range: "$150k - $200k+" }
  ],
  growthRate: 15.2,
  demandLevel: "High",
  topSkills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  marketOutlook: "Technology sector continues to show strong growth with increasing demand for full-stack developers and AI specialists.",
  keyTrends: [
    "AI/ML integration in applications",
    "Cloud-native development", 
    "DevOps and automation",
    "Mobile-first design"
  ],
  recommendedSkills: ["TypeScript", "AWS", "Docker", "GraphQL", "Next.js"]
});

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) return getDefaultInsights();

  try {
    // Try database with fast timeout
    const { db } = await Promise.race([
      import("@/lib/prisma"),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database timeout")), 300)
      )
    ]);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user?.industryInsight) {
      return getDefaultInsights();
    }

    return user.industryInsight;
  } catch (error) {
    console.log("Dashboard using fallback data:", error.message);
    return getDefaultInsights();
  }
}

export async function getUserStats() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const { db } = await Promise.race([
      import("@/lib/prisma"),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database timeout")), 300)
      )
    ]);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        assessments: true,
        coverLetter: true,
        resume: true,
      },
    });

    if (!user) {
      return {
        resumeCount: 0,
        coverLetterCount: 0,
        assessmentCount: 0,
        avgScore: 0
      };
    }

    return {
      resumeCount: user.resume ? 1 : 0,
      coverLetterCount: user.coverLetter.length,
      assessmentCount: user.assessments.length,
      avgScore: user.assessments.length > 0 
        ? user.assessments.reduce((sum, a) => sum + a.quizScore, 0) / user.assessments.length
        : 0
    };
  } catch (error) {
    console.log("User stats using fallback:", error.message);
    return {
      resumeCount: 0,
      coverLetterCount: 0, 
      assessmentCount: 0,
      avgScore: 0
    };
  }
}
