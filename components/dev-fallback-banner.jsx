import { getGeminiModel } from "@/lib/gemini";

export default async function DevFallbackBanner() {
  // Server-side check
  const gemini = getGeminiModel();
  const dbUrl = process.env.DATABASE_URL || null;

  const showGemini = !gemini;
  const showDb = !dbUrl;

  if (!showGemini && !showDb) return null;

  return (
    <div className="w-full bg-yellow-600/10 border-t border-yellow-600/20 text-yellow-300 py-2 text-center text-sm">
      <div className="container mx-auto px-4">
        <strong className="mr-2">Dev Notice:</strong>
        {showGemini && <span className="mr-2">AI service not configured (GEMINI_API_KEY). Using local fallbacks.</span>}
        {showDb && <span>Database connection not configured (DATABASE_URL). Using DB fallbacks.</span>}
      </div>
    </div>
  );
}
