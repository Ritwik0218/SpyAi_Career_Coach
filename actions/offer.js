"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { db } from "@/lib/prisma";
import { requireProAccess } from "@/lib/check-tier";

export async function evaluateOffer(offerDetails) {
  try {
    // PRO-only feature
    await requireProAccess();

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const {
      role,
      baseSalary,
      signOnBonus,
      equity,
      vestingYears,
      targetBonus
    } = offerDetails;

    // Standard Math: 
    // Sign-on usually paid in Year 1.
    // Equity vests evenly over 'vestingYears'
    const yearlyEquity = equity / vestingYears;
    const yearlyBonusAmount = baseSalary * (targetBonus / 100);

    const tcYear1 = baseSalary + signOnBonus + yearlyEquity + yearlyBonusAmount;
    const tcYear2 = baseSalary + yearlyEquity + yearlyBonusAmount;
    
    // We'll calculate 4 years of data
    const chartData = [
      { year: "Year 1", base: baseSalary, bonus: signOnBonus + yearlyBonusAmount, equity: yearlyEquity, total: tcYear1 },
      { year: "Year 2", base: baseSalary, bonus: yearlyBonusAmount, equity: yearlyEquity, total: tcYear2 },
      { year: "Year 3", base: baseSalary, bonus: yearlyBonusAmount, equity: yearlyEquity, total: tcYear2 },
      { year: "Year 4", base: baseSalary, bonus: yearlyBonusAmount, equity: yearlyEquity, total: tcYear2 },
    ];

    const prompt = `
      You are an expert tech recruiter and salary negotiator. My client has just received a job offer.
      
      Offer Details:
      - Role: ${role}
      - Base Salary: $${baseSalary}
      - Sign-on Bonus: $${signOnBonus}
      - Equity Grant: $${equity} over ${vestingYears} years
      - Target Annual Bonus: ${targetBonus}%
      
      Total Comp Year 1: $${tcYear1}
      Total Comp Year 2+: $${tcYear2}
      
      Please provide a brief assessment of this offer. Is it structured well? Are there red flags?
      Then, provide a professional but firm **Negotiation Email Script** the candidate can send to ask for 10-15% more, specifically targeting either a higher base or more equity. Format in Markdown.
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);

    return {
      chartData,
      assessment: result.response.text(),
    };
  } catch (error) {
    console.error("Error evaluating offer:", error);
    throw new Error("Failed to evaluate offer. Please try again.");
  }
}
