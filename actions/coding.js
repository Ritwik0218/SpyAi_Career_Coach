"use strict";
"use server";

import { auth } from "@clerk/nextjs/server";

export async function getNeetCodeTutorResponse(problemId, userCode, language, chatHistory, problemContext) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `You are a world-class Data Structures and Algorithms tutor specializing in the NeetCode 150.
Your goal is to help the user solve the problem: ${problemContext.title} (${problemContext.category}).

Problem Description:
${problemContext.description}

The user's current code in ${language}:
\`\`\`${language}
${userCode}
\`\`\`

Their previous chat history:
${chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

INSTRUCTIONS:
1. DO NOT just give the final answer right away unless the user explicitly asks for the full optimal solution.
2. If their code has a bug, point out the line or the logic error and ask them how they might fix it.
3. If they are stuck on the approach, give them a small hint about the data structure or algorithm to use (e.g., "Have you considered using a Hash Map to store values we've already seen?").
4. If they ask for the optimal solution, provide the cleanest, most efficient NeetCode-style solution in ${language}, along with a brief explanation of Time and Space complexity.
5. Be encouraging, concise, and format your code snippets nicely.
`;

  try {
    const { getGeminiModel } = await import("@/lib/gemini");
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("AI Tutor Error:", err);
    // Add a simple retry mechanism for 503 high demand errors
    if (err.message?.includes("503") || err.message?.includes("high demand")) {
      try {
        console.log("Retrying AI Tutor request due to 503...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s
        const { getGeminiModel } = await import("@/lib/gemini");
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (retryErr) {
        throw new Error("Failed to get response from AI Tutor after retry.");
      }
    }
    throw new Error("Failed to get response from AI Tutor.");
  }
}

export async function generateCategoryCheatsheet(category, language, problems) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const problemTitles = problems.map(p => p.title).join(", ");

  const prompt = `You are an expert Data Structures and Algorithms instructor.
Create a comprehensive, premium cheatsheet for the NeetCode category "\${category}" using the \${language} programming language.

The problems in this category are: \${problemTitles}.

Structure the Markdown output exactly like this:
# \${category} Cheatsheet (\${language})

## 🧠 Core Concepts & Patterns
Explain the fundamental concepts, data structures, and algorithmic patterns used to solve problems in this category. Be concise but extremely insightful.

## 🛠️ Common Boilerplate / Templates
Provide 1-2 standard code templates or patterns in \${language} that are frequently used in this category (e.g., standard sliding window template, standard DFS template).

## 🧩 Key Problems & Approaches
For each of the main problems (\${problemTitles}):
- **Problem**: Name
- **Hint/Approach**: 1-2 sentences on the trick to solving it.
- **Time & Space**: Big O complexity.
- **Code Snippet**: The optimal core logic (doesn't have to be the full class, just the essential function) in \${language}.

## 🎯 Quick Self-Quiz
Provide 3 short, challenging multiple-choice or short-answer questions to test the user's understanding of this category's core concepts. Include the answers hidden at the very bottom.

Make it extremely readable and formatted beautifully with markdown.
`;

  try {
    const { getGeminiModel } = await import("@/lib/gemini");
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Cheatsheet Generation Error:", err);
    throw new Error("Failed to generate cheatsheet.");
  }
}
