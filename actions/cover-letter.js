"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const model = getGeminiModel();
    let content;
    if (!model) {
      // AI not configured — create a safe, simple cover letter template
      logFallback('cover_letter_fallback', { userId: user.id, jobTitle: data.jobTitle, company: data.companyName });
      content = `Dear Hiring Manager,\n\nI am excited to apply for the ${data.jobTitle} role at ${data.companyName}. With experience in ${user.industry} and skills in ${user.skills?.join(", ") || "relevant areas"}, I believe I can contribute to your team. In my previous roles, I have delivered measurable results by focusing on impact and strong execution. I look forward to the opportunity to discuss how my background aligns with ${data.companyName}'s needs.\n\nSincerely,\n${user.name || "Candidate"}`;
    } else {
      const result = await model.generateContent(prompt);
      // The API may return a response object where text() is async — await it and
      // handle multiple possible shapes defensively to avoid runtime errors
      try {
        if (result?.response && typeof result.response.text === "function") {
          content = (await result.response.text()).trim();
        } else if (result?.output && Array.isArray(result.output) && result.output[0]?.content?.text) {
          content = String(result.output[0].content.text).trim();
        } else if (typeof result === "string") {
          content = result.trim();
        } else {
          // Fallback: stringify whatever we have
          content = String(result).slice(0, 2000).trim();
        }
      } catch (parseErr) {
        // Log parse error and fall back to a safe template
        console.error("Error parsing Gemini response:", parseErr, result);
        logFallback('cover_letter_parse_failed', { userId: user.id, err: String(parseErr) });
        content = `Dear Hiring Manager,\n\nI am excited to apply for the ${data.jobTitle} role at ${data.companyName}. With experience in ${user.industry} and skills in ${user.skills?.join(", ") || "relevant areas"}, I believe I can contribute to your team. In my previous roles, I have delivered measurable results by focusing on impact and strong execution. I look forward to the opportunity to discuss how my background aligns with ${data.companyName}'s needs.\n\nSincerely,\n${user.name || "Candidate"}`;
      }
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    // Log full error (stack) so server logs contain actionable details in CI/Vercel
    console.error("Error generating cover letter:", error);
    // Surface a generic error upward to avoid leaking sensitive info to clients
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) return []; // Return empty array instead of throwing error

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return []; // Return empty array instead of throwing error

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
