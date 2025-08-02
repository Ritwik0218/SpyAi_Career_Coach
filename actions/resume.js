"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

// Add new AI functions for comprehensive resume improvement
export async function improveEntireResume(resumeContent) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer and career coach, comprehensively improve this entire resume for a ${user.industry} professional.
    
    Current Resume:
    "${resumeContent}"
    
    Requirements:
    1. Enhance the professional summary to be more impactful
    2. Optimize skills section with industry-relevant keywords
    3. Improve work experience descriptions with action verbs and quantifiable achievements
    4. Ensure ATS (Applicant Tracking System) optimization
    5. Maintain proper formatting and structure
    6. Add industry-specific keywords and trending skills
    7. Focus on measurable results and achievements
    8. Ensure consistency in tense and formatting
    
    Return the improved resume in the same markdown format, keeping the structure but enhancing the content quality.
    Do not add any explanations or additional text - just return the improved resume content.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedResume = response.text().trim();
    return improvedResume;
  } catch (error) {
    console.error("Error improving entire resume:", error);
    throw new Error("Failed to improve resume");
  }
}

export async function generateSuggestions(section, currentContent) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As a career expert, provide 3-5 specific suggestions to improve the ${section} section for a ${user.industry} professional.
    
    Current content: "${currentContent || 'Not provided'}"
    
    Provide actionable, specific suggestions that:
    1. Use industry-relevant keywords
    2. Include quantifiable achievements where possible
    3. Follow best practices for ${section}
    4. Are tailored to ${user.industry} industry
    
    Format as a JSON array of strings: ["suggestion1", "suggestion2", "suggestion3"]
    Return only the JSON array without any additional text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestions = JSON.parse(response.text().trim());
    return suggestions;
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw new Error("Failed to generate suggestions");
  }
}

export async function generateResumeSection(section, userInfo) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompts = {
    summary: `
      Create a compelling professional summary for a ${user.industry} professional with ${user.experience} experience.
      User background: ${user.bio || 'Not provided'}
      Skills: ${user.skills?.join(', ') || 'Not specified'}
      
      The summary should be:
      - 3-4 sentences long
      - Highlight key achievements and skills
      - Industry-specific and impactful
      - ATS-optimized with relevant keywords
      
      Return only the summary text without any additional formatting or explanations.
    `,
    skills: `
      Generate a comprehensive skills list for a ${user.industry} professional with ${user.experience} experience.
      Current skills: ${user.skills?.join(', ') || 'Not specified'}
      Industry insights: ${user.industryInsight?.topSkills?.join(', ') || 'General skills'}
      
      Include:
      - Technical skills relevant to ${user.industry}
      - Soft skills important for the role
      - Industry-specific tools and technologies
      - Trending skills in the field
      
      Format as a comma-separated list. Return only the skills without any additional text.
    `
  };

  const prompt = prompts[section];
  if (!prompt) {
    throw new Error("Invalid section specified");
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedContent = response.text().trim();
    return generatedContent;
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    throw new Error(`Failed to generate ${section}`);
  }
}

// Add content generation function
export async function generateContent(section, userData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompts = {
    summary: `Create a compelling professional summary for a ${user.industry} professional with ${userData.experience || 'some'} experience. Include key strengths, expertise areas, and career objectives. Make it ATS-friendly with industry keywords.`,
    skills: `Generate a comprehensive skills list for a ${user.industry} professional. Include technical skills, soft skills, and industry-specific competencies. Format as a comma-separated list or bullet points.`,
    experience: `Generate a sample work experience entry for a ${user.industry} role. Include job title, company, duration, and 3-4 achievement-focused bullet points with quantifiable results.`,
    education: `Generate a sample education entry relevant to ${user.industry}. Include degree, institution, and relevant coursework or achievements.`,
    project: `Generate a sample project description for a ${user.industry} professional. Include project name, description, technologies used, and measurable outcomes.`
  };

  const prompt = prompts[section] || prompts.summary;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedContent = response.text().trim();
    return generatedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}

// ATS Analysis Functions
export async function analyzeResumeATS(resumeContent, jobDescription, targetRole, companyName) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert ATS (Applicant Tracking System) analyzer and resume optimization specialist, perform a comprehensive analysis of this resume against the provided job description.
    
    RESUME CONTENT:
    "${resumeContent}"
    
    JOB DESCRIPTION:
    "${jobDescription}"
    
    TARGET ROLE:
    "${targetRole}"
    
    COMPANY:
    "${companyName}"
    
    Provide a detailed ATS analysis in the following JSON format:
    {
      "atsScore": number (0-100),
      "overallAssessment": "detailed assessment",
      "keywordAnalysis": {
        "matchedKeywords": ["keyword1", "keyword2"],
        "missingKeywords": ["keyword3", "keyword4"],
        "keywordDensity": number (percentage)
      },
      "sectionAnalysis": {
        "professionalSummary": {
          "score": number (0-100),
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"]
        },
        "skills": {
          "score": number (0-100),
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"]
        },
        "experience": {
          "score": number (0-100),
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"]
        },
        "education": {
          "score": number (0-100),
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"]
        },
        "formatting": {
          "score": number (0-100),
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"]
        }
      },
      "recommendations": {
        "immediate": ["action1", "action2"],
        "shortTerm": ["action3", "action4"],
        "longTerm": ["action5", "action6"]
      },
      "industryBenchmark": {
        "averageScore": number,
        "topPerformerScore": number,
        "yourRanking": "percentile"
      }
    }
    
    Analyze:
    1. Keyword matching and density
    2. ATS-friendly formatting
    3. Quantifiable achievements
    4. Industry-specific terminology
    5. Section completeness and quality
    6. Overall alignment with job requirements
    
    Return only the JSON object without any additional text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysisResult = JSON.parse(response.text().trim());
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}

export async function optimizeResumeSection(sectionContent, sectionType, jobDescription, targetRole, companyName) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an ATS optimization expert, optimize this ${sectionType} section to achieve maximum ATS compatibility and relevance for the target role.
    
    CURRENT ${sectionType.toUpperCase()} SECTION:
    "${sectionContent}"
    
    JOB DESCRIPTION:
    "${jobDescription}"
    
    TARGET ROLE:
    "${targetRole}"
    
    COMPANY:
    "${companyName}"
    
    Optimization Requirements:
    1. Include relevant keywords from the job description
    2. Use ATS-friendly formatting
    3. Quantify achievements where possible
    4. Use action verbs and industry terminology
    5. Maintain natural readability
    6. Optimize keyword density (2-3% for key terms)
    7. Align with ${user.industry} industry standards
    
    Return the optimized section content without any additional explanations or formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const optimizedContent = response.text().trim();
    return optimizedContent;
  } catch (error) {
    console.error("Error optimizing section:", error);
    throw new Error("Failed to optimize section");
  }
}

export async function generateATSKeywords(jobDescription, targetRole, resumeContent = "", companyName) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    Extract and generate the most important ATS keywords for this role and job description.
    
    JOB DESCRIPTION:
    "${jobDescription}"
    
    TARGET ROLE:
    "${targetRole}"
    
    COMPANY:
    "${companyName}"
    
    CURRENT RESUME (for gap analysis):
    "${resumeContent}"
    
    Provide keywords in this JSON format:
    {
      "primaryKeywords": ["keyword1", "keyword2"],
      "secondaryKeywords": ["keyword3", "keyword4"],
      "technicalSkills": ["skill1", "skill2"],
      "softSkills": ["skill3", "skill4"],
      "industryTerms": ["term1", "term2"],
      "certifications": ["cert1", "cert2"],
      "tools": ["tool1", "tool2"],
      "missingFromResume": ["missing1", "missing2"]
    }
    
    Focus on:
    1. High-frequency terms from job description
    2. Industry-standard terminology
    3. Required skills and qualifications
    4. Relevant tools and technologies
    5. Common variations of key terms
    
    Return only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const keywords = JSON.parse(response.text().trim());
    return keywords;
  } catch (error) {
    console.error("Error generating keywords:", error);
    throw new Error("Failed to generate keywords");
  }
}

export async function generateOptimizedResume(resumeContent, jobDescription, targetRole, companyName) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer and ATS specialist, create a fully optimized version of this resume tailored for the specific job and role.
    
    ORIGINAL RESUME:
    "${resumeContent}"
    
    JOB DESCRIPTION:
    "${jobDescription}"
    
    TARGET ROLE:
    "${targetRole}"
    
    COMPANY:
    "${companyName}"
    
    Create an ATS-optimized resume that:
    1. Achieves 90+ ATS compatibility score
    2. Incorporates relevant keywords naturally
    3. Uses quantifiable achievements
    4. Maintains professional formatting
    5. Aligns with industry standards for ${user.industry}
    6. Optimizes keyword density without stuffing
    7. Uses action verbs and impactful language
    8. Ensures readability for both ATS and humans
    
    Maintain the original structure and format but enhance:
    - Professional summary with targeted keywords
    - Skills section with job-relevant competencies
    - Experience descriptions with quantified achievements
    - Education section if relevant
    - Overall keyword integration
    
    Return the complete optimized resume in markdown format without any additional explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const optimizedResume = response.text().trim();
    return optimizedResume;
  } catch (error) {
    console.error("Error generating optimized resume:", error);
    throw new Error("Failed to generate optimized resume");
  }
}
