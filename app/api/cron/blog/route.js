import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getGeminiModel } from "@/lib/gemini";

// Curated list of high-quality professional office/career images
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop", // Team meeting
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&h=900&fit=crop", // Modern office
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop", // Laptop typing
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&h=900&fit=crop", // Suitcase/business
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&h=900&fit=crop"  // Woman at laptop
];

export async function GET(req) {
  try {
    // Vercel Cron secures the endpoint automatically if CRON_SECRET is set,
    // but we can also add a manual check if needed.
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json({ error: "Unauthorized cron call" }, { status: 401 });
    }

    const prompt = \`
      You are an expert career coach writing for the SPY AI Career Blog.
      Generate a professional, highly engaging blog post about career advice.
      
      Requirements:
      1. Choose a highly relevant topic (e.g., "How to Negotiate a Tech Offer", "Top 5 Resume Mistakes", "Acing the System Design Interview", "Transitioning to AI").
      2. Provide a Catchy Title on the first line.
      3. Provide the rest of the post in clean Markdown format. 
      4. Length: Around 300-500 words.
      
      Format:
      TITLE: [Your Title Here]
      
      [Your Markdown Body Here]
    \`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the response
    const titleMatch = text.match(/TITLE:\s*(.*)/i);
    const title = titleMatch ? titleMatch[1].trim() : "Career Advice for Modern Professionals";
    let content = text.replace(/TITLE:\s*(.*)/i, "").trim();

    // Get a random image
    const randomImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

    // Save to database
    const post = await db.blogPost.create({
      data: {
        title,
        content,
        imageUrl: randomImage
      }
    });

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("Cron Blog Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
