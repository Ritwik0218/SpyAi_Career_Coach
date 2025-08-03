import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/function";

// Check if Inngest is properly configured and not in development
const hasValidInngestKeys = 
  process.env.NODE_ENV === 'production' &&
  process.env.INNGEST_EVENT_KEY && 
  process.env.INNGEST_SIGNING_KEY &&
  process.env.INNGEST_EVENT_KEY !== 'your_inngest_event_key_here' &&
  process.env.INNGEST_SIGNING_KEY !== 'your_inngest_signing_key_here';

// Fallback handlers for when Inngest is not configured
const fallbackHandlers = {
  GET: async () => {
    return new Response(
      JSON.stringify({ message: 'Inngest not configured - using fallback' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  },
  POST: async () => {
    return new Response(
      JSON.stringify({ message: 'Inngest not configured - background jobs disabled' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  },
  PUT: async () => {
    return new Response(
      JSON.stringify({ message: 'Inngest not configured - background jobs disabled' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  },
};

// Export handlers
let handlers;

if (hasValidInngestKeys) {
  try {
    handlers = serve({
      client: inngest,
      functions: [generateIndustryInsights],
    });
  } catch (error) {
    console.warn('Failed to initialize Inngest handlers, using fallback:', error.message);
    handlers = fallbackHandlers;
  }
} else {
  handlers = fallbackHandlers;
}

export const { GET, POST, PUT } = handlers;
