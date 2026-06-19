"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

export const generateAIInsights = async (industry, country = "Worldwide") => {
  const prompt = `
          Analyze the current state of the ${industry} industry in ${country} and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          For the "role" field, strictly use specific job titles (e.g., "Frontend Developer", "Machine Learning Engineer", "Product Manager") rather than generic experience levels like "Entry Level" or "Senior".
          All salary numbers should be representative of the ${country} market (convert to USD equivalent if necessary, or just use typical numbers for that region).
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const model = getGeminiModel();
  if (!model) {
    logFallback('dashboard_insights_fallback', { industry, country });
    // AI not configured — return a conservative fallback
    return {
      salaryRanges: [
        { role: "Senior", min: 60000, max: 120000, median: 90000, location: country },
        { role: "Mid", min: 40000, max: 80000, median: 60000, location: country }
      ],
      growthRate: 3,
      demandLevel: "Medium",
      topSkills: ["communication", "collaboration", "industry knowledge"],
      marketOutlook: "Neutral",
      keyTrends: ["remote work", "automation", "data-driven decisions"],
      recommendedSkills: ["communication", "technical skills", "productivity tools"]
    };
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights(country = "Worldwide") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const targetIndustry = user.industry || "Software Engineering";

  const industryInsight = await db.industryInsight.findUnique({
    where: {
      industry_country: {
        industry: targetIndustry,
        country: country
      }
    }
  });

  // If no insights exist for this country, generate them
  if (!industryInsight) {
    const targetIndustry = user.industry || "Software Engineering";
    const insights = await generateAIInsights(targetIndustry, country);

    const newInsight = await db.industryInsight.create({
      data: {
        industry: targetIndustry,
        country: country,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return newInsight;
  }

  return industryInsight;
}

export async function generateCareerSyllabus(targetRole) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true, experience: true }
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    The user's current industry is \${user.industry || 'unknown'}, with \${user.experience || 'some'} years of experience.
    Their current skills are: \${user.skills?.join(', ') || 'none specified'}.
    
    They want to transition or level up to the following target role: "\${targetRole}".
    
    Perform a gap analysis between their current skills and the target role. 
    Then generate a structured, 4-week learning syllabus to help them bridge this gap.
    
    Format the response as Markdown. Include:
    - **Gap Analysis**: A brief summary of what they are missing.
    - **Week 1-4 Roadmap**: Specific, actionable steps, concepts to learn, and project ideas.
    - **Recommended Resources**: Types of courses or tools they should use.
  `;

  try {
    const model = getGeminiModel();
    if (!model) {
      return `# Career Syllabus for ${targetRole}\n\n**Gap Analysis:** You need to learn the core skills for this role.\n\n**Week 1-4:** Focus on fundamentals, build a small project, and update your resume.\n\n*AI analysis unavailable due to missing configuration.*`;
    }
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating career syllabus:", error);
    throw new Error("Failed to generate syllabus.");
  }
}
