import { GoogleGenerativeAI } from "@google/generative-ai";
import { logFallback } from "./fallback-logger";

let __geminiModel = null;

export function getGeminiModel() {
  if (__geminiModel) return __geminiModel;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    logFallback('gemini_init_skipped', { reason: 'GEMINI_API_KEY not set' });
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(key);
    const primaryModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const primaryModel = genAI.getGenerativeModel({ model: primaryModelName });
    
    // Setup a fallback model just in case we hit the free tier quota on the new 2.5 model
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Intercept generateContent to automatically fallback
    const originalGenerateContent = primaryModel.generateContent.bind(primaryModel);
    
    primaryModel.generateContent = async (...args) => {
      try {
        return await originalGenerateContent(...args);
      } catch (err) {
        if (err.message && err.message.includes("429 Too Many Requests")) {
          console.warn(`[GEMINI] Rate limit hit for ${primaryModelName}. Falling back to gemini-1.5-flash.`);
          return await fallbackModel.generateContent(...args);
        }
        throw err;
      }
    };

    __geminiModel = primaryModel;
    return __geminiModel;
  } catch (err) {
    logFallback('gemini_init_failed', { message: err?.message || String(err) });
    return null;
  }
}

export default getGeminiModel;
