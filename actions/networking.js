"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { db } from "@/lib/prisma";

export async function generateColdEmail({ targetPerson, targetRole, targetCompany, tone }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { resume: true },
    });

    if (!user) throw new Error("User not found");

    const resumeContent = user.resume?.content || "No resume data provided. The user is a professional in their field.";

    const prompt = `
      You are an expert career coach and executive recruiter helping a candidate write a highly effective, personalized cold outreach email.
      
      Target Person: ${targetPerson || "Hiring Manager"}
      Target Role: ${targetRole || "Open Role"}
      Target Company: ${targetCompany || "Your Company"}
      Desired Tone: ${tone || "Professional and polite"}
      
      Candidate's Background (from Resume):
      ${resumeContent}
      
      Write a compelling, concise cold email that the candidate can send to the target person. 
      The email should:
      1. Have an eye-catching subject line.
      2. Hook the reader immediately.
      3. Briefly mention 1-2 highly relevant achievements or skills from the candidate's background that align with the target role/company.
      4. End with a clear, low-friction call to action (e.g., a quick 10-minute chat or coffee).
      
      Format the output in clean Markdown. Provide the Subject Line first, then the email body.
      Do not include any placeholders like [Your Name] if the name is available in the resume, use the real name. If not, use a placeholder.
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating cold email:", error);
    throw new Error("Failed to generate cold email. Please try again.");
  }
}
