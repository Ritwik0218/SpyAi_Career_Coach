"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          let insights;
          
          try {
            insights = await generateAIInsights(data.industry);
          } catch (error) {
            console.log("AI generation failed, using default insights:", error.message);
            // Fallback to default insights if AI fails
            insights = {
              salaryRanges: [
                { role: "Entry Level", min: 40000, max: 60000, median: 50000, location: "US" },
                { role: "Mid Level", min: 60000, max: 90000, median: 75000, location: "US" },
                { role: "Senior Level", min: 90000, max: 130000, median: 110000, location: "US" },
                { role: "Lead/Manager", min: 120000, max: 160000, median: 140000, location: "US" },
                { role: "Director", min: 150000, max: 200000, median: 175000, location: "US" }
              ],
              growthRate: 5.5,
              demandLevel: "High",
              topSkills: ["Communication", "Problem Solving", "Leadership", "Teamwork", "Adaptability"],
              marketOutlook: "Positive",
              keyTrends: ["Digital Transformation", "Remote Work", "AI Integration", "Sustainability", "Data Analytics"],
              recommendedSkills: ["Digital Literacy", "Critical Thinking", "Project Management", "Data Analysis", "Innovation"]
            };
          }

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    return result.user;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { isOnboarded: false }; // Return default instead of throwing error

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
