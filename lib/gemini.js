import { GoogleGenerativeAI } from "@google/generative-ai";

let __geminiModel = null;

export function getGeminiModel() {
  if (__geminiModel) return __geminiModel;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const genAI = new GoogleGenerativeAI(key);
    __geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return __geminiModel;
  } catch (err) {
    console.warn("Failed to initialize Gemini model:", err?.message || err);
    return null;
  }
}

export default getGeminiModel;
