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
    __geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return __geminiModel;
  } catch (err) {
    logFallback('gemini_init_failed', { message: err?.message || String(err) });
    return null;
  }
}

export default getGeminiModel;
