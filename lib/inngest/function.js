import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { getGeminiModel } from "@/lib/gemini";
import { logFallback } from "@/lib/fallback-logger";

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
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
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      const model = getGeminiModel();
      let insights;
      if (!model) {
        console.info(`GEMINI_API_KEY not configured — using fallback insights for ${industry}`);
        logFallback('inngest_industry_insights_fallback', { industry });
        insights = {
          salaryRanges: [
            { role: "Senior", min: 70000, max: 140000, median: 100000, location: "Remote" },
            { role: "Mid", min: 45000, max: 90000, median: 65000, location: "Remote" },
            { role: "Junior", min: 30000, max: 60000, median: 45000, location: "Remote" },
            { role: "Lead", min: 90000, max: 170000, median: 120000, location: "Remote" },
            { role: "Manager", min: 80000, max: 150000, median: 110000, location: "Remote" }
          ],
          growthRate: 3,
          demandLevel: "Medium",
          topSkills: ["communication", "domain knowledge", "problem solving", "collaboration", "adaptability"],
          marketOutlook: "Neutral",
          keyTrends: ["automation", "remote work", "AI augmentation", "reskilling", "platform consolidation"],
          recommendedSkills: ["communication", "technical skills", "domain expertise", "data literacy"]
        };
      } else {
        try {
          const res = await step.ai.wrap(
            "gemini",
            async (p) => {
              return await model.generateContent(p);
            },
            prompt
          );

          const text = res.response.candidates[0].content.parts[0].text || "";
          const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

          insights = JSON.parse(cleanedText);
        } catch (err) {
          console.error(`Failed to generate/parse industry insights for ${industry}:`, err?.message || err);
          logFallback('inngest_industry_insights_parse_error', { industry, error: String(err?.message || err) });
          // Fallback to a conservative insight payload so update continues
          insights = {
            salaryRanges: [
              { role: "Senior", min: 70000, max: 140000, median: 100000, location: "Remote" },
              { role: "Mid", min: 45000, max: 90000, median: 65000, location: "Remote" }
            ],
            growthRate: 2,
            demandLevel: "Medium",
            topSkills: ["communication", "domain knowledge", "problem solving"],
            marketOutlook: "Neutral",
            keyTrends: ["automation", "remote work", "AI augmentation"],
            recommendedSkills: ["communication", "technical skills"]
          };
        }
      }

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
