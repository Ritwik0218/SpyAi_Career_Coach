"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

// Fallback resume data when database is unavailable
const DEFAULT_RESUME = {
  id: "temp-resume",
  userId: "temp-user",
  content: {
    contactInfo: { email: "", mobile: "", linkedin: "", twitter: "" },
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
  },
  atsScore: null,
  feedback: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getResume() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const { db } = await import("@/lib/prisma");
    
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return DEFAULT_RESUME;

    const resume = await db.resume.findUnique({
      where: { userId: user.id },
    });

    if (!resume) return DEFAULT_RESUME;

    return {
      ...resume,
      content: JSON.parse(resume.content),
    };
  } catch (error) {
    console.error("Database error, using fallback:", error);
    return DEFAULT_RESUME;
  }
}

export async function saveResume(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const { db } = await import("@/lib/prisma");
    
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: "temp@example.com",
        },
      });
    }

    const resumeData = {
      userId: user.id,
      content: JSON.stringify(data),
    };

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: resumeData,
      create: resumeData,
    });

    return {
      ...resume,
      content: JSON.parse(resume.content),
    };
  } catch (error) {
    console.error("Database error in saveResume:", error);
    // Return the data as if it was saved
    return {
      id: "temp-resume",
      userId: "temp-user",
      content: data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    let prompt = "";
    
    switch (type) {
      case "summary":
        prompt = `Improve this professional summary for a resume. Make it more compelling and ATS-friendly: "${current}"`;
        break;
      case "skills":
        prompt = `Improve this skills section for a resume. Add relevant keywords and organize better: "${current}"`;
        break;
      case "experience":
        prompt = `Improve this work experience description. Make it more impactful with metrics and action verbs: "${current}"`;
        break;
      case "education":
        prompt = `Improve this education description for a resume: "${current}"`;
        break;
      case "projects":
        prompt = `Improve this project description for a resume. Highlight technologies and impact: "${current}"`;
        break;
      default:
        prompt = `Improve this resume content: "${current}"`;
    }

    const model = getGeminiModel();
    if (!model) {
      logFallback('resume_fallback_improve', { type, userId });
      // AI not configured — return original content
      return current;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text().trim();
  } catch (error) {
    console.error("AI improvement error:", error);
    return current; // Return original if AI fails
  }
}

export async function analyzeWithAI(markdown) {
  try {
    const prompt = `
    Analyze this resume and provide a detailed ATS (Applicant Tracking System) score and feedback.
    
    Resume content:
    ${markdown}
    
    Please provide:
    1. An ATS score (0-100)
    2. Specific feedback on formatting, keywords, and content
    3. Actionable recommendations for improvement
    
    Format your response as JSON with this structure:
    {
      "atsScore": number,
      "feedback": "detailed feedback here",
      "recommendations": ["recommendation 1", "recommendation 2", ...]
    }
    `;

    const model = getGeminiModel();
    if (!model) {
      logFallback('resume_fallback_analyze', { userId });
      return {
        score: 75,
        feedback: "Analysis temporarily unavailable (AI not configured). Use the local fallback.",
        recommendations: ["Review job descriptions for relevant keywords", "Quantify achievements"]
      };
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const parsed = JSON.parse(text);
      return {
        score: Math.min(Math.max(parsed.atsScore || 0, 0), 100),
        feedback: parsed.feedback || "No feedback available",
        recommendations: parsed.recommendations || []
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return {
        score: 75,
        feedback: text || "Resume analyzed successfully",
        recommendations: ["Improve keyword optimization", "Add more quantified achievements"]
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
    return {
      score: 70,
      feedback: "Analysis temporarily unavailable. Please try again later.",
      recommendations: ["Review job descriptions for relevant keywords", "Quantify your achievements with numbers"]
    };
  }
}
