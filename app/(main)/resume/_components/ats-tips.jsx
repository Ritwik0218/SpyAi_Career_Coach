"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, CheckCircle2 } from "lucide-react";

const tips = [
  {
    icon: Target,
    title: "Keyword Optimization",
    content: "Use keywords from the job description naturally throughout your resume. Aim for 2-3% keyword density.",
  },
  {
    icon: TrendingUp,
    title: "Quantify Achievements",
    content: "Include numbers, percentages, and metrics wherever possible. ATS systems love quantifiable results.",
  },
  {
    icon: CheckCircle2,
    title: "Action Verbs",
    content: "Start bullet points with strong action verbs like 'implemented', 'optimized', 'increased', 'managed'.",
  },
  {
    icon: Lightbulb,
    title: "ATS Formatting",
    content: "Use standard headings, bullet points, and avoid complex formatting that ATS systems can't read.",
  },
];

export function ATSTips({ isAnalyzing = false }) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  const tip = tips[currentTip];
  const Icon = tip.icon;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Icon className="h-4 w-4 text-green-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-green-800">{tip.title}</h4>
            <p className="text-sm text-green-700">{tip.content}</p>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-4 rounded-full transition-colors ${
                index === currentTip ? "bg-green-600" : "bg-green-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
