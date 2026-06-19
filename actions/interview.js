"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

export async function generateQuiz(customSkill) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = customSkill
    ? `
    Generate 10 technical interview questions for a professional on the specific skill/topic: "${customSkill}".
    These should be industry-level, comprehensive questions, including data structures, algorithms, coding problems, or advanced concepts if applicable.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `
    : `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const model = getGeminiModel();
    if (!model) {
      logFallback('interview_quiz_fallback', { userId: userId, industry: user.industry, customSkill });
      // AI not configured — return a small static quiz as fallback
      return [
        {
          question: customSkill 
            ? `What is a core concept or best practice when working with ${customSkill}?`
            : `What is a good practice when preparing for ${user.industry} interviews?`,
          options: ["Practice problem solving", "Ignore documentation", "Proceed without checking details", "Rely entirely on chance"],
          correctAnswer: "Practice problem solving",
          explanation: `Preparing and checking standard concepts is essential when building expertise in ${customSkill || user.industry}.`
        }
      ];
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

      try {
        const model = getGeminiModel();
        if (model) {
          const tipResult = await model.generateContent(improvementPrompt);
          improvementTip = tipResult.response.text().trim();
          console.log(improvementTip);
        } else {
          logFallback('interview_tip_skipped', { userId: userId });
          console.info("GEMINI_API_KEY not configured — skipping improvement tip generation");
        }
      } catch (error) {
        console.error("Error generating improvement tip:", error);
        // Continue without improvement tip if generation fails
      }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

export async function generateBehavioralQuestions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, experience: true }
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 3 behavioral interview questions for a professional in the \${user.industry} industry with \${user.experience || 'some'} years of experience.
    The questions should be open-ended "Tell me about a time..." style questions.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        "string", "string", "string"
      ]
    }
  `;

  try {
    const model = getGeminiModel();
    if (!model) {
      logFallback('interview_behavioral_fallback', { userId });
      return [
        "Tell me about a time you had to overcome a significant challenge at work.",
        "Describe a situation where you had a conflict with a coworker and how you resolved it.",
        "Give me an example of a time when you showed initiative."
      ];
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/\`\`\`(?:json)?\\n?/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    return parsed.questions;
  } catch (error) {
    console.error("Error generating behavioral questions:", error);
    throw new Error("Failed to generate behavioral questions");
  }
}

export async function analyzeBehavioralResponse(question, transcript, timeSpentSeconds, fillerCount) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    The user was asked the following behavioral interview question:
    "\${question}"
    
    Here is the live transcript of their spoken answer:
    "\${transcript}"
    
    They took \${timeSpentSeconds} seconds to answer, and used \${fillerCount} filler words.
    
    Analyze their answer based on the STAR method (Situation, Task, Action, Result) and general communication skills.
    
    Return a JSON response with:
    - "score": A number from 0 to 100 representing overall confidence and quality.
    - "feedback": A 2-3 sentence paragraph providing constructive feedback. Include feedback on their speaking pace and use of filler words.
    - "starAnalysis": A short object evaluating if they hit S, T, A, R successfully.
    
    Format:
    {
      "score": number,
      "feedback": "string",
      "starAnalysis": {
        "Situation": "string (Pass/Fail/Partial)",
        "Task": "string",
        "Action": "string",
        "Result": "string"
      }
    }
  `;

  try {
    const model = getGeminiModel();
    if (!model) {
      logFallback('interview_behavioral_analysis_fallback', { userId });
      return {
        score: 75,
        feedback: "Your response was decent, but without AI analysis configured, detailed STAR feedback is unavailable. Try to reduce filler words.",
        starAnalysis: { Situation: "Pass", Task: "Pass", Action: "Pass", Result: "Pass" }
      };
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/\`\`\`(?:json)?\\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing behavioral response:", error);
    throw new Error("Failed to analyze response");
  }
}

export async function saveBehavioralResult(results) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const avgScore = results.reduce((acc, r) => acc + r.score, 0) / results.length;

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: avgScore,
        category: "Behavioral",
        questions: results.map(r => ({
          question: r.question,
          userAnswer: r.transcript,
          feedback: r.feedback,
          score: r.score,
          starAnalysis: r.starAnalysis,
        })),
      },
    });
    return assessment;
  } catch (error) {
    console.error("Error saving behavioral result:", error);
    throw new Error("Failed to save result");
  }
}
