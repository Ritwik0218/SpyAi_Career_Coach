"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

// Standard prompt template for generating a new LeetCode style problem
const GENERATE_PROBLEM_PROMPT = `
You are an expert technical interviewer and software engineer.
Generate the problem description, starter code, solution code, and test execution code for a coding problem.

You MUST return ONLY valid JSON in the exact format shown below, with no markdown code blocks wrapping the response, no conversational text, and no explanations.

{
  "description": "The full markdown description of the problem. Use '### Constraints' and '### Expected Complexity' (with bullet points for Time and Space) as markdown headers at the very end.",
  "examples": [
    { "input": "...", "output": "..." }
  ],
  "starterCode": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "..."
  },
  "solutionCode": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "..."
  },
  "testExecutionCode": {
    "javascript": "console.log('=== Running Test Cases ===');\\n...",
    "python": "print('=== Running Test Cases ===')\\n...",
    "cpp": "int main() {\\n...\\nreturn 0;\\n}",
    "java": "class Main {\\npublic static void main(String[] args) {\\n...\\n}\\n}"
  }
}

The problem to generate is: 
Title: {TITLE}
Category: {CATEGORY}

The testExecutionCode must actually contain code to run against the solution (e.g. print the output to console) using standard I/O so our frontend can execute it via Piston API.
IMPORTANT: The testExecutionCode MUST run the solution against multiple test cases (at least 3-5) and print EXACTLY: "Test Cases: X/Y Passed" as the VERY LAST LINE of its output (where X is the number of passing tests and Y is the total tests).
If not all pass, it should still print that line (e.g. "Test Cases: 1/3 Passed").
`;

export async function getProblemsByCategory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const problems = await db.codingProblem.findMany({
    orderBy: { category: 'asc' },
    select: {
      id: true,
      title: true,
      category: true,
      difficulty: true,
      link: true,
    }
  });

  return problems;
}

export async function getOrGenerateProblem(problemId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let problem = await db.codingProblem.findUnique({
    where: { id: problemId }
  });

  if (!problem) throw new Error("Problem not found");

  // If the description exists, we assume it's already generated and seeded
  if (problem.description && problem.starterCode) {
    return problem;
  }

  // Generate it dynamically
  const model = getGeminiModel();
  if (!model) {
    logFallback('coding_prep_fallback', { problemId });
    throw new Error("AI service is not configured. Cannot generate problem details.");
  }

  const prompt = GENERATE_PROBLEM_PROMPT
    .replace("{TITLE}", problem.title)
    .replace("{CATEGORY}", problem.category);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    const generatedData = JSON.parse(cleanedText);

    problem = await db.codingProblem.update({
      where: { id: problemId },
      data: {
        description: generatedData.description,
        examples: generatedData.examples,
        starterCode: generatedData.starterCode,
        solutionCode: generatedData.solutionCode,
        testExecutionCode: generatedData.testExecutionCode,
      }
    });

    return problem;
  } catch (error) {
    console.error("Gemini AI error generating problem:", error);
    if (error.message && error.message.includes("429 Too Many Requests")) {
      throw new Error("Gemini API Rate Limit Exceeded. Please try again later.");
    }
    throw new Error("Failed to generate problem details via AI. The JSON output might have been malformed.");
  }
}
