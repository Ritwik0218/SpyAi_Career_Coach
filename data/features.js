import {
  BrainCircuit,
  Briefcase,
  LineChart,
  ScrollText,
  Handshake,
  FileSearch,
  PenLine,
} from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and industry insights powered by Gemini AI — tailored to your role, experience, and goals.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific mock questions, get instant AI feedback, and track your improvement over time with performance charts.",
  },
  {
    icon: <Handshake className="w-10 h-10 mb-4 text-primary" />,
    title: "Salary Negotiation Coach",
    description:
      "Paste what HR actually said and get real, choice-based coaching on exactly how to respond — not hypothetical, based on your real offer.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Live Industry Insights",
    description:
      "Stay ahead with real-time salary benchmarks, trending skills, market demand, and growth trajectory analysis for your industry.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "ATS Resume Builder",
    description:
      "Build ATS-optimized resumes with live preview, font & density controls, overflow detection, and one-click PDF or Word export.",
  },
  {
    icon: <FileSearch className="w-10 h-10 mb-4 text-primary" />,
    title: "ATS Score Analyzer",
    description:
      "Upload any resume and instantly receive a detailed ATS compatibility score with actionable keyword and formatting suggestions.",
  },
  {
    icon: <PenLine className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Cover Letter Generator",
    description:
      "Generate tailored, company-specific cover letters in seconds — with full markdown editing, tone adjustment, and role-specific language.",
  },
];
