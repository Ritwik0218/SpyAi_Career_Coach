"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export function QuickATSScore({ resumeContent }) {
  const [score, setScore] = useState(0);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!resumeContent?.trim()) {
      setScore(0);
      setInsights([]);
      return;
    }

    calculateQuickScore(resumeContent);
  }, [resumeContent]);

  const calculateQuickScore = (content) => {
    let totalScore = 0;
    let scoreInsights = [];

    // Basic length check (20 points)
    if (content.length > 500) {
      totalScore += 20;
      scoreInsights.push({ type: "good", text: "Resume has good content length" });
    } else {
      scoreInsights.push({ type: "warning", text: "Resume content seems too short" });
    }

    // Contact information (15 points)
    const hasEmail = /@/.test(content);
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content);
    if (hasEmail && hasPhone) {
      totalScore += 15;
      scoreInsights.push({ type: "good", text: "Contact information present" });
    } else {
      scoreInsights.push({ type: "warning", text: "Missing contact information" });
    }

    // Skills section (15 points)
    const hasSkills = /skills?/i.test(content);
    if (hasSkills) {
      totalScore += 15;
      scoreInsights.push({ type: "good", text: "Skills section identified" });
    } else {
      scoreInsights.push({ type: "warning", text: "No skills section found" });
    }

    // Experience section (20 points)
    const hasExperience = /(experience|work|employment)/i.test(content);
    if (hasExperience) {
      totalScore += 20;
      scoreInsights.push({ type: "good", text: "Experience section found" });
    } else {
      scoreInsights.push({ type: "warning", text: "No experience section found" });
    }

    // Action verbs (10 points)
    const actionVerbs = ["developed", "managed", "created", "implemented", "improved", "increased", "optimized", "led", "achieved"];
    const hasActionVerbs = actionVerbs.some(verb => new RegExp(verb, "i").test(content));
    if (hasActionVerbs) {
      totalScore += 10;
      scoreInsights.push({ type: "good", text: "Action verbs detected" });
    } else {
      scoreInsights.push({ type: "warning", text: "Consider adding more action verbs" });
    }

    // Numbers/metrics (10 points)
    const hasNumbers = /\d+%|\$\d+|[0-9]+\s*(million|thousand|k|users|projects)/i.test(content);
    if (hasNumbers) {
      totalScore += 10;
      scoreInsights.push({ type: "good", text: "Quantified achievements found" });
    } else {
      scoreInsights.push({ type: "warning", text: "Add quantified achievements" });
    }

    // Education section (10 points)
    const hasEducation = /(education|degree|university|college)/i.test(content);
    if (hasEducation) {
      totalScore += 10;
      scoreInsights.push({ type: "good", text: "Education section present" });
    }

    setScore(Math.min(totalScore, 100));
    setInsights(scoreInsights);
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  if (!resumeContent?.trim()) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Add resume content to see quick ATS score
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="h-4 w-4" />
          Quick ATS Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          <Progress value={score} className="mt-2" />
          <Badge variant="outline" className="mt-2">
            {getScoreBadge()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Insights:</h4>
          {insights.slice(0, 3).map((insight, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {insight.type === "good" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
              )}
              <span className={insight.type === "good" ? "text-green-700" : "text-yellow-700"}>
                {insight.text}
              </span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          For detailed analysis, use the full ATS analyzer
        </p>
      </CardContent>
    </Card>
  );
}
