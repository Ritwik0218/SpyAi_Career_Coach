"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function optimizeLinkedInProfile(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("file");
  const linkedInUrl = formData.get("url") || "";

  if (!file) throw new Error("LinkedIn PDF export is required");

  // Parse the PDF
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  let pdfText = "";
  
  try {
    const pdfData = await pdfParse(buffer);
    pdfText = pdfData.text;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Failed to read the PDF. Please ensure it is a valid LinkedIn profile export.");
  }

  // Optimize with Gemini
  const model = getGeminiModel();
  if (!model) throw new Error("AI Model not available");

  const prompt = `
    You are an expert technical recruiter and career coach. The user has provided their LinkedIn profile exported as a PDF.
    Your task is to analyze the profile and provide targeted, actionable advice to optimize it for ATS systems and recruiters.
    
    Here is the profile text extracted from the PDF:
    """
    ${pdfText}
    """
    
    ${linkedInUrl ? `Here is their LinkedIn URL for context: ${linkedInUrl}` : ''}
    
    Please provide your analysis in the following JSON structure exactly:
    {
      "overallScore": 0, // A score out of 100 for the overall profile strength
      "headline": {
        "current": "Extracted current headline",
        "feedback": "Explain exactly what is wrong or not good with their current headline",
        "suggestions": ["Exact new headline to write 1", "Exact new headline to write 2"]
      },
      "summary": {
        "feedback": "Critique their About/Summary section. Be direct about what is missing or bad.",
        "suggestions": ["A complete rewritten paragraph suggestion", "Another specific structural suggestion"]
      },
      "experience": {
        "feedback": "Critique their experience. Be direct about missing metrics, poor action verbs, etc.",
        "suggestions": ["Exact bullet point rewrite 1", "Exact bullet point rewrite 2"]
      },
      "skills": {
        "feedback": "Feedback on their skills section and what might be missing for modern tech roles",
        "suggestions": ["Skill to add 1", "Skill to add 2"]
      }
    }
    
    IMPORTANT: Respond ONLY with the raw JSON object. Do not wrap it in markdown block quotes (\`\`\`json) or add any conversational text. Use markdown (e.g. **bold**) in your feedback and suggestions strings to format them nicely.
  `;

  try {
    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    
    // Clean up potential markdown formatting from Gemini
    if (rawText.startsWith('\`\`\`json')) rawText = rawText.slice(7);
    if (rawText.startsWith('\`\`\`')) rawText = rawText.slice(3);
    if (rawText.endsWith('\`\`\`')) rawText = rawText.slice(0, -3);
    
    const analysis = JSON.parse(rawText.trim());
    return analysis;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to analyze the profile using AI. Please try again.");
  }
}
