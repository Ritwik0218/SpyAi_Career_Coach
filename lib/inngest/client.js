import { Inngest } from "inngest";

// Create Inngest client with proper fallbacks
const inngestConfig = {
  id: "spy-ai-career-coach", // Updated to be more descriptive and kebab-case
  name: "SPY AI Career Coach",
};

// Only add credentials if they're properly configured
if (
  process.env.INNGEST_EVENT_KEY && 
  process.env.INNGEST_EVENT_KEY !== 'your_inngest_event_key_here'
) {
  inngestConfig.eventKey = process.env.INNGEST_EVENT_KEY;
}

if (
  process.env.INNGEST_SIGNING_KEY && 
  process.env.INNGEST_SIGNING_KEY !== 'your_inngest_signing_key_here'
) {
  inngestConfig.signingKey = process.env.INNGEST_SIGNING_KEY;
}

export const inngest = new Inngest(inngestConfig);
