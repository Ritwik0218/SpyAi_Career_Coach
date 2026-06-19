"use server";

import { auth } from "@clerk/nextjs/server";

/**
 * Build a fully-realized 5-stage negotiation training session.
 * Personalized with real company/role/salary/location data.
 */
function buildTrainingSession(role, company, currentOffer, targetSalary, currency, country, state) {
  const offerNum = parseInt(currentOffer) || 800000;
  const targetNum = parseInt(targetSalary) || 1200000;
  const revisedOffer = Math.round(offerNum * 1.08);
  const joiningBonus = Math.round(offerNum * 0.06);

  const fmt = (n) => n.toLocaleString("en-IN");

  return {
    role,
    company,
    currency,
    country,
    state,
    rounds: [
      /* ─── Stage 1: Opening Offer ─────────────────────────────── */
      {
        stageNumber: 1,
        stageName: "Opening Offer",
        stageIcon: "🎉",
        hrMessage: `Congratulations! We're absolutely thrilled to extend you an offer for the ${role} position here at ${company}. After reviewing your profile, we'd like to offer a base salary of ${currency} ${fmt(offerNum)} per annum. We're excited — can we count you in?`,
        choices: [
          {
            id: "A",
            text: `Wow, that's great! I accept — when do I start?`,
            quality: "poor",
            verdictLabel: "❌ Weak Move",
            explanation: "Accepting instantly signals you didn't negotiate at all. You likely left significant money on the table. Recruiters expect a counter — this surprises them in the wrong way.",
          },
          {
            id: "B",
            text: `Thank you so much — I'm genuinely excited about this opportunity! Before I give you my decision, could you walk me through the complete compensation package, including bonuses, equity, and benefits?`,
            quality: "excellent",
            verdictLabel: "✅ Best Move",
            explanation: "Perfect. You express enthusiasm (keeps the recruiter comfortable), you don't commit, and you gather crucial package details. This buys time and gives you more negotiating ammunition.",
          },
          {
            id: "C",
            text: `Appreciate the offer, but that number is quite a bit below my expectations. I'll need significantly more.`,
            quality: "poor",
            verdictLabel: "❌ Risky Opening",
            explanation: "Opening with a blunt rejection without data or professionalism puts the recruiter on the defensive before negotiations even begin. Relationship damage at this stage is hard to recover from.",
          },
          {
            id: "D",
            text: `Thank you! I'd like 24–48 hours to review the offer before responding, if that's okay.`,
            quality: "good",
            verdictLabel: "👍 Smart Move",
            explanation: "Asking for time is always acceptable and buys you space to strategize. However, also asking for the full package breakdown (like option B) is even more powerful.",
          },
        ],
        bestChoiceId: "B",
        whatToSay: `"Thank you — I'm excited! Could you walk me through the full package including base, bonus, equity, and benefits before I respond?"`,
        whatNotToSay: `Never say "I accept!" immediately. And never open with a blunt rejection. Both extremes destroy your leverage instantly.`,
        proTip: `💡 Pro Tip: The first 60 seconds after receiving an offer are the most critical. Respond warmly, show genuine interest — but never commit. Always ask: "Can you walk me through the full package?"`,
      },

      /* ─── Stage 2: Anchoring a Counter ───────────────────────── */
      {
        stageNumber: 2,
        stageName: "Anchoring Your Counter",
        stageIcon: "⚓",
        hrMessage: `Of course! Here's the full picture for the ${role} role at ${company}: ${currency} ${fmt(offerNum)} base salary, a 10–15% annual performance bonus, 20 days paid leave, complete health coverage for you and your family, and flexible work arrangements. We believe it's a very competitive package. What are your thoughts?`,
        choices: [
          {
            id: "A",
            text: `That's much better than I expected! You've got a deal — I'm in.`,
            quality: "poor",
            verdictLabel: "❌ Revealed Too Much",
            explanation: "Never reveal that the offer exceeded your expectations. That phrase instantly removes every scrap of negotiating leverage you had. The recruiter now knows they didn't need to offer more.",
          },
          {
            id: "B",
            text: `I appreciate the transparency. Based on my research of industry benchmarks for ${role} positions in ${state}, ${country}, I was targeting a base closer to ${currency} ${fmt(targetNum)}. Is there any flexibility on the base salary?`,
            quality: "excellent",
            verdictLabel: "✅ Best Move",
            explanation: "Textbook negotiation: you acknowledge the package positively, anchor your counter with market data, and frame the ask as a collaborative question rather than a demand. This is powerful.",
          },
          {
            id: "C",
            text: `The perks are nice, but I had a number around ${currency} ${fmt(targetNum)} in mind for the base. Any flexibility there?`,
            quality: "good",
            verdictLabel: "👍 Good Move",
            explanation: "Stating your target number is good. Backing it with market research data (as in option B) makes it significantly more persuasive.",
          },
          {
            id: "D",
            text: `My friend got a better deal at a smaller company, so I know the market pays more.`,
            quality: "poor",
            verdictLabel: "❌ Unprofessional",
            explanation: "Referencing anecdotal 'friend' data is unconvincing and sounds unprofessional. Recruiters will dismiss this instantly. Always use credible market sources: Glassdoor, LinkedIn, AmbitionBox.",
          },
        ],
        bestChoiceId: "B",
        whatToSay: `"Based on my research of ${role} salaries in ${state}, ${country} — from sources like Glassdoor and LinkedIn — the market range sits around ${currency} ${fmt(targetNum)}. Is there flexibility on the base?"`,
        whatNotToSay: `Never say "That's more than I expected!" And never cite a friend's salary as evidence. Both are immediate leverage-killers.`,
        proTip: `💡 Pro Tip: Name your number first. Research consistently shows that whoever anchors first in a negotiation has a statistical advantage. Anchor high, but back it with real market data.`,
      },

      /* ─── Stage 3: Justifying Your Ask ───────────────────────── */
      {
        stageNumber: 3,
        stageName: "Justifying Your Ask",
        stageIcon: "📊",
        hrMessage: `We appreciate that you've done your homework. However, ${currency} ${fmt(targetNum)} is above our standard band for this role. Could you help me understand what specifically makes you feel your profile justifies that figure?`,
        choices: [
          {
            id: "A",
            text: `I just know I'm worth it — I've always been a top performer on every team I've been on.`,
            quality: "poor",
            verdictLabel: "❌ No Evidence",
            explanation: "Gut feelings and self-assessments without evidence have zero negotiating weight. Recruiters hear this constantly. You need concrete, quantified proof.",
          },
          {
            id: "B",
            text: `My ask is based on concrete evidence: I have significant domain experience, and in my previous role I delivered measurable results — for example, I reduced process costs by 28% and led a team that shipped a product ahead of schedule. These outcomes align my profile with the upper band of the market range.`,
            quality: "excellent",
            verdictLabel: "✅ Best Move",
            explanation: "This is evidence-based negotiation at its finest. You cite specific, quantified achievements that prove your value. Numbers speak louder than adjectives in every salary conversation.",
          },
          {
            id: "C",
            text: `I have strong skills in this domain and I'm confident I can add real value to your team.`,
            quality: "neutral",
            verdictLabel: "⚠️ Too Vague",
            explanation: "Everyone says this. 'Strong skills' and 'add value' without specific examples carry no persuasive weight. You need to quantify your impact.",
          },
          {
            id: "D",
            text: `I currently have a competing offer from another company for a higher amount, which reflects my market value.`,
            quality: "good",
            verdictLabel: "👍 Strong (If True)",
            explanation: "A real competing offer is the most powerful negotiating leverage there is. But only use this if it's genuinely true — bluffing this can end the offer entirely if called out.",
          },
        ],
        bestChoiceId: "B",
        whatToSay: `"My ask is backed by specific results: I [did X] that led to [Y% improvement / ₹Z cost savings / metric]. This places my profile at the upper end of the market range."`,
        whatNotToSay: `Never say "I think I'm worth it" or "I work very hard." These are opinions with no evidential weight. Use the STAR method: Situation → Task → Action → measurable Result.`,
        proTip: `💡 Pro Tip: Prepare at least 3 quantified achievements before any salary discussion. "Reduced customer churn by 22%" beats "great at customer success" in every negotiation, every time.`,
      },

      /* ─── Stage 4: Handling Pushback ─────────────────────────── */
      {
        stageNumber: 4,
        stageName: "Handling the Pushback",
        stageIcon: "🛡️",
        hrMessage: `We really value everything you bring. After checking with our finance team, the absolute best we can stretch to on the base is ${currency} ${fmt(revisedOffer)} — that's a meaningful increase from our opening offer. Can we close this today?`,
        choices: [
          {
            id: "A",
            text: `Fine. I'll take it.`,
            quality: "poor",
            verdictLabel: "❌ Missed Opportunity",
            explanation: "Accepting instantly the moment a counter is made signals that you were never really committed to your number. Always acknowledge the movement, then explore what else is on the table.",
          },
          {
            id: "B",
            text: `I appreciate you stretching the budget — that's a real gesture of goodwill. The revised base is much closer to where I need to be. Would it also be possible to explore a performance-linked review at 6 months, or a joining bonus to bridge the remaining gap? I genuinely want to make this work.`,
            quality: "excellent",
            verdictLabel: "✅ Best Move",
            explanation: "When the base salary ceiling is hit, pivot to other negotiables: signing bonus, accelerated review, extra leave, remote days, or a learning budget. There's always more to negotiate beyond base.",
          },
          {
            id: "C",
            text: `That's still below where I need to be. I'm afraid I'll have to decline.`,
            quality: "poor",
            verdictLabel: "❌ Premature Ultimatum",
            explanation: "Issuing a 'take it or leave it' ultimatum when the company just showed goodwill by moving their number is high-risk. Only walk away when you truly have a better offer in hand.",
          },
          {
            id: "D",
            text: `Thank you for moving on the number. Can we also lock in the performance review timeline so I know what hitting targets means for next year's compensation?`,
            quality: "good",
            verdictLabel: "👍 Smart Move",
            explanation: "Excellent instinct — securing clarity on future compensation is valuable even when today's base doesn't fully hit target. A 6-month review with clear KPIs can be worth a lot.",
          },
        ],
        bestChoiceId: "B",
        whatToSay: `"I appreciate you moving — that's a meaningful gesture. Could we also look at a joining bonus or an accelerated performance review to bridge the remaining gap? I want to make this work for both sides."`,
        whatNotToSay: `Never accept instantly when they make a counter. Never issue ultimatums unless you genuinely have a better offer you're willing to accept right now.`,
        proTip: `💡 Pro Tip: Base salary is just one piece of Total Compensation (TC). Signing bonuses, equity, remote days, professional development budgets, and review timelines all have real, calculable financial value.`,
      },

      /* ─── Stage 5: Closing the Deal ──────────────────────────── */
      {
        stageNumber: 5,
        stageName: "Closing the Deal",
        stageIcon: "🤝",
        hrMessage: `After speaking with our leadership team, here is our final offer: ${currency} ${fmt(revisedOffer)} base salary plus a one-time joining bonus of ${currency} ${fmt(joiningBonus)}. This is genuinely the best we can do, and we would love to have you at ${company}. What do you say?`,
        choices: [
          {
            id: "A",
            text: `Thank you for going the extra mile — the joining bonus really bridges the gap here. I'm happy to accept. Could we get the formal offer letter confirmed by end of this week so I can notify my current employer?`,
            quality: "excellent",
            verdictLabel: "✅ Perfect Close",
            explanation: "Textbook: you thank genuinely, confirm acceptance warmly, and immediately set the next concrete milestone (offer letter date). This is professional, gracious, and forward-looking.",
          },
          {
            id: "B",
            text: `OK, I accept.`,
            quality: "neutral",
            verdictLabel: "⚠️ Acceptable but Flat",
            explanation: "Technically fine — the deal is done. But a warm, forward-looking close sets a better tone for your pre-joining relationship with the company.",
          },
          {
            id: "C",
            text: `I need a bit more time to think about it.`,
            quality: "poor",
            verdictLabel: "❌ Stalling Too Late",
            explanation: "Further stalling when a genuine final offer with a bonus is on the table reads as indecisive and can make the company second-guess your commitment. Only delay if you truly need to evaluate another offer.",
          },
          {
            id: "D",
            text: `It's still a bit low, but I'll take it since I really need this job right now.`,
            quality: "poor",
            verdictLabel: "❌ Never Say This",
            explanation: "Revealing desperation ('I need this job') permanently destroys your leverage for every future raise and promotion negotiation. Always close with confidence, not concession.",
          },
        ],
        bestChoiceId: "A",
        whatToSay: `"Thank you for making this work — I'm happy to accept. When can I expect the formal offer letter so I can plan my transition?"`,
        whatNotToSay: `Never stall when a genuinely good deal is on the table. And NEVER say you 'need' the job or that you're settling. It poisons your entire future at that company.`,
        proTip: `💡 Pro Tip: How you close a negotiation sets the tone for your entire relationship with the employer. Your first performance review — and first raise — starts the moment you accept. Close graciously and set a clear next step.`,
      },
    ],
  };
}

export async function initNegotiationTraining({
  role,
  company,
  currentOffer,
  targetSalary,
  currency = "INR",
  country = "India",
  state = "Haryana",
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return buildTrainingSession(role, company, currentOffer, targetSalary, currency, country, state);
}

/* ─── Real HR Message Analyzer ──────────────────────────────────── */
export async function analyzeRealHRMessage({
  hrMessage,
  role,
  company,
  currentOffer,
  targetSalary,
  currency = "INR",
  country = "India",
  state = "Haryana",
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!hrMessage?.trim()) throw new Error("HR message is required");

  const prompt = `You are an expert salary negotiation coach. A candidate is in a real salary negotiation for a ${role} position at ${company} in ${state}, ${country}.

Their current offer is: ${currency} ${currentOffer}
Their target salary is: ${currency} ${targetSalary}

The HR / Recruiter just said:
"${hrMessage.trim()}"

Analyze exactly what HR said and generate a coaching response in this EXACT JSON format (no markdown, no code blocks, just valid JSON):
{
  "situationAnalysis": "2-3 sentences explaining what HR is actually doing/signaling with this message and what the candidate's leverage is right now",
  "negotiationStage": "one of: Opening Offer | Exploring Requirements | Pushback | Counter Negotiation | Final Offer | Pressure Tactic | Benefits Discussion | Other",
  "hrIntent": "What is HR trying to achieve with this message? Be specific.",
  "choices": [
    {
      "id": "A",
      "text": "A realistic, word-for-word response the candidate could say",
      "quality": "excellent",
      "verdictLabel": "✅ Best Move",
      "explanation": "Why this specific response works well given exactly what HR said"
    },
    {
      "id": "B",
      "text": "A second realistic response — good but not optimal",
      "quality": "good",
      "verdictLabel": "👍 Good Move",
      "explanation": "Why this works and what it misses"
    },
    {
      "id": "C",
      "text": "A response that sounds okay but has a hidden weakness",
      "quality": "neutral",
      "verdictLabel": "⚠️ Risky",
      "explanation": "What makes this response problematic given the context"
    },
    {
      "id": "D",
      "text": "A response that most people would say but that actually hurts them",
      "quality": "poor",
      "verdictLabel": "❌ Avoid This",
      "explanation": "Why this response destroys leverage or sounds unprofessional"
    }
  ],
  "bestChoiceId": "A",
  "whatToSay": "The exact phrasing the candidate should use, in quotes, tailored to what HR actually said",
  "whatNotToSay": "Specific phrases or approaches to avoid given this exact HR message",
  "proTip": "One actionable, specific negotiation insight based on what HR said — what the signal behind the message means and how to use it"
}

Rules:
- All 4 choices must be realistic, complete sentences the candidate would actually say
- Base everything on the REAL HR message, not hypotheticals
- The "excellent" choice should be diplomatically assertive, data-backed where possible
- The "poor" choice should be something many people actually say that hurts them
- Keep all text concise and direct`;

  try {
    const { getGeminiModel } = await import("@/lib/gemini");
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if model adds them
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate minimal shape
    if (!parsed.choices || !Array.isArray(parsed.choices) || parsed.choices.length < 2) {
      throw new Error("Invalid AI response shape");
    }

    return {
      hrMessage: hrMessage.trim(),
      role, company, currency, country, state,
      situationAnalysis: parsed.situationAnalysis || "",
      negotiationStage: parsed.negotiationStage || "Negotiation",
      hrIntent: parsed.hrIntent || "",
      choices: parsed.choices,
      bestChoiceId: parsed.bestChoiceId || parsed.choices[0].id,
      whatToSay: parsed.whatToSay || "",
      whatNotToSay: parsed.whatNotToSay || "",
      proTip: parsed.proTip || "",
    };
  } catch (err) {
    // ── Fallback: smart heuristic analysis when AI is unavailable ──
    const msg = hrMessage.toLowerCase();
    const isFinalOffer = msg.includes("best we can") || msg.includes("final offer") || msg.includes("maximum");
    const isPressure = msg.includes("deadline") || msg.includes("by end of") || msg.includes("other candidates") || msg.includes("exploding");
    const isOpening = msg.includes("pleased to offer") || msg.includes("we'd like to offer") || msg.includes("offer you");
    const isPushback = msg.includes("budget") || msg.includes("band") || msg.includes("can't go") || msg.includes("not possible");

    let stage = "Counter Negotiation";
    let intent = "Assessing your flexibility on the offer";
    let situationAnalysis = `HR has made a statement about your ${role} offer at ${company}. This is a pivotal moment — your response will determine how much room is left to negotiate.`;
    let whatToSay = `"I appreciate you sharing that. Based on my research of the ${role} market in ${state}, ${country}, I was targeting ${currency} ${targetSalary}. Is there any flexibility on the base or the overall package?"`;
    let whatNotToSay = "Don't say 'I accept' immediately, and don't reveal desperation or that this is your only offer.";
    let proTip = `💡 Whatever HR says, pause for 3–5 seconds before responding. Silence signals confidence and forces HR to fill the gap — often with a concession.`;

    if (isFinalOffer) {
      stage = "Final Offer";
      intent = "Signalling budget ceiling — testing if you'll walk or fold";
      situationAnalysis = `HR is claiming this is their 'final' offer. In most cases this is a negotiation tactic, not a hard limit. The key question is: are there other levers (joining bonus, review date, remote days) still on the table?`;
      whatToSay = `"I appreciate you being transparent. The base is close to where I need to be. Would it be possible to include a joining bonus or an accelerated 6-month review to bridge the remaining gap? I really want to make this work."`;
      whatNotToSay = `Don't say "Okay, I'll take it" immediately. And don't issue an ultimatum unless you genuinely have a competing offer in hand.`;
      proTip = `💡 "Final offer" is said in ~70% of negotiations before a concession is made. Pivot to non-base compensation: signing bonus, review date, extra leave, or remote days.`;
    } else if (isPressure) {
      stage = "Pressure Tactic";
      intent = "Creating artificial urgency to get you to decide before you're ready";
      situationAnalysis = `HR is applying deadline pressure — a classic tactic to prevent you from shopping other offers or thinking clearly. This pressure is almost always negotiable.`;
      whatToSay = `"I want to make a decision I'm confident in, which I know benefits both of us long-term. Could you give me until [date] to review and confirm? I'm genuinely excited about this role."`;
      whatNotToSay = `Don't panic and accept under pressure. Don't say "I need more time" without offering a specific date — that sounds evasive.`;
      proTip = `💡 Always respond to deadline pressure with a specific alternative date rather than vague stalling. "Can I confirm by Thursday?" is far stronger than "I need a few more days."`;
    } else if (isOpening) {
      stage = "Opening Offer";
      intent = "Presenting the initial offer — testing whether you'll negotiate or accept immediately";
      situationAnalysis = `This is the opening offer stage. The number HR says first is almost never their best number. Your goal right now is NOT to accept or reject — it's to gather more information and buy time.`;
      whatToSay = `"Thank you so much — I'm genuinely excited about this opportunity! Before I respond, could you walk me through the complete package including bonuses, equity, and benefits? I want to evaluate the full picture."`;
      whatNotToSay = `Never say "That sounds great, I'll take it!" at this stage. And never say "That's lower than I expected" without data to back it up.`;
      proTip = `💡 The first rule of negotiation: whoever speaks first after an offer is made is at a disadvantage. Say "Thank you, can I have 24 hours?" — even if you plan to counter immediately.`;
    } else if (isPushback) {
      stage = "Pushback";
      intent = "Telling you the budget is limited — often to anchor you lower than necessary";
      situationAnalysis = `HR is referencing budget constraints or salary bands. This is standard pushback and does not mean the number is unmovable. Salary bands have ranges — you want to be at the top of theirs.`;
      whatToSay = `"I understand there are budget considerations. My ask is based on market data for ${role} in ${state} — sources like LinkedIn and Glassdoor show ${currency} ${targetSalary} is within the standard range. Is there flexibility within the band?"`;
      whatNotToSay = `Don't accept "that's the budget" as final. Don't cite a friend's salary as evidence — only use verifiable market sources.`;
      proTip = `💡 When HR cites a "salary band", ask: "Where does this offer sit within the band?" If you're at the bottom, there is always room to move up within the same band.`;
    }

    return {
      hrMessage: hrMessage.trim(),
      role, company, currency, country, state,
      situationAnalysis,
      negotiationStage: stage,
      hrIntent: intent,
      choices: [
        {
          id: "A",
          text: `"Thank you for sharing that. Could you walk me through the full package — including any performance bonus, equity, and review timelines — before I give you my decision?"`,
          quality: "excellent",
          verdictLabel: "✅ Best Move",
          explanation: "You acknowledge positively, stay non-committal, and gather critical information. This is always the strongest immediate response to any HR statement.",
        },
        {
          id: "B",
          text: whatToSay.replace(/^"|"$/g, ""),
          quality: "good",
          verdictLabel: "👍 Good Move",
          explanation: "This is a solid counter tailored to the situation. It's direct and data-aware, though it commits a little early without gathering all available information first.",
        },
        {
          id: "C",
          text: `"I understand, but I was really hoping for something closer to ${currency} ${targetSalary}. Is there any room at all?"`,
          quality: "neutral",
          verdictLabel: "⚠️ Weak Counter",
          explanation: "The phrasing 'any room at all' signals low confidence and makes you sound like you'll settle for anything. A counter needs a specific number backed by data.",
        },
        {
          id: "D",
          text: `"Okay, that's fine, I can accept that."`,
          quality: "poor",
          verdictLabel: "❌ Never Say This",
          explanation: "Accepting without countering in any way signals that you weren't serious about your number. You almost certainly left money on the table.",
        },
      ],
      bestChoiceId: "A",
      whatToSay,
      whatNotToSay,
      proTip,
    };
  }
}
