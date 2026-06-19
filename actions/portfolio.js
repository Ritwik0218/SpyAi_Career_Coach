"use server";

import { auth } from "@clerk/nextjs/server";
import { getGeminiModel } from "@/lib/gemini";
import { db } from "@/lib/prisma";
import { requireProAccess } from "@/lib/check-tier";

export async function generatePortfolio(styleTheme) {
  try {
    // PRO-only feature
    await requireProAccess();

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { resume: true },
    });

    if (!user) throw new Error("User not found");

    const resumeContent = user.resume?.content || "User is a professional software engineer with a passion for building great products.";

    const prompt = `
      You are an expert Frontend Developer and Web Designer. I need you to generate a beautiful, responsive, single-page personal portfolio website for me based on my resume content.
      
      Requirements:
      1. Use ONLY plain HTML and Tailwind CSS (via CDN: <script src="https://cdn.tailwindcss.com"></script>).
      2. Do NOT use any external CSS files or JS frameworks.
      3. Include Font Awesome for icons (via CDN: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">).
      4. The style/theme should be: ${styleTheme || "Minimalist & Clean"}. Adjust the Tailwind colors, typography, and spacing to match this theme.
      5. Include the following sections if data is available:
         - Hero (Name, Headline, CTA)
         - About
         - Experience
         - Projects / Skills
         - Contact Footer
      6. Return ONLY the raw HTML code. Do not include markdown code block backticks like \`\`\`html. Start directly with <!DOCTYPE html> and end with </html>.
      
      My Resume Content:
      ${resumeContent}
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    let htmlCode = result.response.text().trim();
    
    // Clean up if Gemini accidentally includes markdown code block markers
    if (htmlCode.startsWith("\`\`\`html")) {
      htmlCode = htmlCode.replace(/^\`\`\`html\n/, "").replace(/\n\`\`\`$/, "");
    } else if (htmlCode.startsWith("\`\`\`")) {
      htmlCode = htmlCode.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    }

    return htmlCode;
  } catch (error) {
    console.error("Error generating portfolio:", error);
    throw new Error("Failed to generate portfolio. Please try again.");
  }
}
