"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Award } from "lucide-react";

export function QuickATSScore({ resumeContent }) {
  const [score, setScore] = useState(0);
  const [insights, setInsights] = useState([]);
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    if (!resumeContent?.trim()) {
      setScore(0);
      setInsights([]);
      setBreakdown({});
      return;
    }

    calculateComprehensiveScore(resumeContent);
  }, [resumeContent]);

  const calculateComprehensiveScore = (content) => {
    let totalScore = 0;
    let scoreInsights = [];
    let scoreBreakdown = {};

    // 1. Content Length and Structure (20 points)
    if (content.length > 1000 && content.length < 4000) {
      totalScore += 20;
      scoreInsights.push({ type: "good", text: "Resume has optimal length (1000-4000 characters)" });
      scoreBreakdown.length = { score: 20, max: 20, status: "good" };
    } else if (content.length > 500) {
      totalScore += 12;
      scoreInsights.push({ type: "warning", text: "Resume length could be optimized" });
      scoreBreakdown.length = { score: 12, max: 20, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Resume content is too short" });
      scoreBreakdown.length = { score: 0, max: 20, status: "error" };
    }

    // 2. Contact Information (15 points)
    const hasEmail = /@[\w.-]+\.\w+/.test(content);
    const hasPhone = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(content);
    const hasLinkedIn = /linkedin|in\.com/i.test(content);
    
    let contactScore = 0;
    if (hasEmail) contactScore += 7;
    if (hasPhone) contactScore += 5;
    if (hasLinkedIn) contactScore += 3;
    
    totalScore += contactScore;
    scoreBreakdown.contact = { score: contactScore, max: 15, status: contactScore >= 12 ? "good" : contactScore >= 7 ? "warning" : "error" };
    
    if (contactScore >= 12) {
      scoreInsights.push({ type: "good", text: "Complete contact information provided" });
    } else if (contactScore >= 7) {
      scoreInsights.push({ type: "warning", text: "Consider adding LinkedIn or complete contact details" });
    } else {
      scoreInsights.push({ type: "error", text: "Missing essential contact information" });
    }

    // 3. Professional Summary (15 points)
    const hasSummary = /summary|profile|objective|about/i.test(content);
    const summaryQuality = content.match(/\b(experienced|skilled|proficient|expert|leader|managed|achieved|developed|improved)\b/gi)?.length || 0;
    
    let summaryScore = 0;
    if (hasSummary) {
      summaryScore += 8;
      if (summaryQuality >= 3) summaryScore += 7;
      else if (summaryQuality >= 1) summaryScore += 4;
    }
    
    totalScore += summaryScore;
    scoreBreakdown.summary = { score: summaryScore, max: 15, status: summaryScore >= 12 ? "good" : summaryScore >= 8 ? "warning" : "error" };
    
    if (summaryScore >= 12) {
      scoreInsights.push({ type: "good", text: "Strong professional summary with impact words" });
    } else if (summaryScore >= 8) {
      scoreInsights.push({ type: "warning", text: "Professional summary needs more achievement-focused language" });
    } else {
      scoreInsights.push({ type: "error", text: "Add a compelling professional summary" });
    }

    // 4. Skills Section (15 points)
    const hasSkillsSection = /skills|competencies|expertise|technologies|tools/i.test(content);
    const skillKeywords = content.match(/\b(JavaScript|Python|React|Node|SQL|AWS|Docker|Git|Adobe|Office|Excel|PowerPoint|Salesforce|Marketing|Management|Leadership|Communication|Analysis|Project)\b/gi)?.length || 0;
    
    let skillsScore = 0;
    if (hasSkillsSection) {
      skillsScore += 8;
      if (skillKeywords >= 8) skillsScore += 7;
      else if (skillKeywords >= 4) skillsScore += 4;
      else if (skillKeywords >= 1) skillsScore += 2;
    }
    
    totalScore += skillsScore;
    scoreBreakdown.skills = { score: skillsScore, max: 15, status: skillsScore >= 12 ? "good" : skillsScore >= 8 ? "warning" : "error" };
    
    if (skillsScore >= 12) {
      scoreInsights.push({ type: "good", text: "Comprehensive skills section with relevant keywords" });
    } else if (skillsScore >= 8) {
      scoreInsights.push({ type: "warning", text: "Skills section could include more specific technologies and tools" });
    } else {
      scoreInsights.push({ type: "error", text: "Add a detailed skills section with industry-relevant keywords" });
    }

    // 5. Work Experience Quality (20 points)
    const experienceMarkers = content.match(/\b(experience|work|employment|position|role|job)\b/gi)?.length || 0;
    const actionVerbs = content.match(/\b(managed|led|developed|created|implemented|improved|increased|achieved|designed|built|optimized|streamlined|collaborated|coordinated|executed|delivered|analyzed|researched|trained|supervised)\b/gi)?.length || 0;
    const quantifiableResults = content.match(/\b(\d+%|\$\d+|\d+\+|\d+k|million|thousand|users|customers|projects|teams|employees)\b/gi)?.length || 0;
    
    let experienceScore = 0;
    if (experienceMarkers >= 1) experienceScore += 5;
    if (actionVerbs >= 3) experienceScore += 8;
    else if (actionVerbs >= 1) experienceScore += 4;
    if (quantifiableResults >= 2) experienceScore += 7;
    else if (quantifiableResults >= 1) experienceScore += 3;
    
    totalScore += experienceScore;
    scoreBreakdown.experience = { score: experienceScore, max: 20, status: experienceScore >= 16 ? "good" : experienceScore >= 10 ? "warning" : "error" };
    
    if (experienceScore >= 16) {
      scoreInsights.push({ type: "good", text: "Excellent work experience with strong action verbs and quantifiable results" });
    } else if (experienceScore >= 10) {
      scoreInsights.push({ type: "warning", text: "Work experience needs more action verbs and quantified achievements" });
    } else {
      scoreInsights.push({ type: "error", text: "Add detailed work experience with measurable accomplishments" });
    }

    // 6. Education and Certifications (10 points)
    const hasEducation = /\b(education|degree|university|college|certification|certified|bachelor|master|phd|diploma|training)\b/gi.test(content);
    const educationDetails = content.match(/\b(bachelor|master|phd|bs|ba|ms|ma|mba|certification|certified|training|course)\b/gi)?.length || 0;
    
    let educationScore = 0;
    if (hasEducation) {
      educationScore += 5;
      if (educationDetails >= 2) educationScore += 5;
      else if (educationDetails >= 1) educationScore += 3;
    }
    
    totalScore += educationScore;
    scoreBreakdown.education = { score: educationScore, max: 10, status: educationScore >= 8 ? "good" : educationScore >= 5 ? "warning" : "error" };
    
    if (educationScore >= 8) {
      scoreInsights.push({ type: "good", text: "Education and certifications well documented" });
    } else if (educationScore >= 5) {
      scoreInsights.push({ type: "warning", text: "Consider adding more educational details or certifications" });
    } else {
      scoreInsights.push({ type: "error", text: "Include education background and relevant certifications" });
    }

    // 7. Formatting and Structure (5 points)
    const hasProperStructure = content.includes('\n') && content.length > 200;
    const hasConsistentFormatting = !/\t{2,}|\s{4,}/.test(content); // Check for excessive spacing
    
    let formatScore = 0;
    if (hasProperStructure) formatScore += 3;
    if (hasConsistentFormatting) formatScore += 2;
    
    totalScore += formatScore;
    scoreBreakdown.formatting = { score: formatScore, max: 5, status: formatScore >= 4 ? "good" : formatScore >= 2 ? "warning" : "error" };

    // Set final results
    setScore(Math.min(totalScore, 100));
    setInsights(scoreInsights);
    setBreakdown(scoreBreakdown);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 55) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-primary" />
          ATS Compatibility Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLevel(score)}
          </div>
          <Progress 
            value={score} 
            className="w-full h-3"
            style={{
              '--progress-background': score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
            }}
          />
        </div>

        {/* Breakdown */}
        {Object.keys(breakdown).length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(breakdown).map(([key, data]) => (
              <div key={`breakdown-${key}`} className="flex items-center justify-between p-2 bg-muted rounded border-border border">
                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">{data.score}/{data.max}</span>
                  {data.status === "good" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                  {data.status === "warning" && <AlertTriangle className="h-3 w-3 text-yellow-600" />}
                  {data.status === "error" && <XCircle className="h-3 w-3 text-red-600" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              Key Insights
            </h4>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <div 
                  key={`insight-${index}`} 
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    insight.type === "good" 
                      ? "bg-success/5 border border-success/20" 
                      : insight.type === "warning"
                      ? "bg-warning/5 border border-warning/20"
                      : "bg-destructive/5 border border-destructive/20"
                  }`}
                >
                  {insight.type === "good" && (
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  )}
                  {insight.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  )}
                  {insight.type === "error" && (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm text-foreground">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {score < 80 && (
          <div className="bg-muted p-4 rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">Quick Improvement Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {score < 60 && <li>• Ensure all contact information is complete</li>}
              {(!breakdown.summary?.score || breakdown.summary.score < 10) && <li>• Add a compelling professional summary</li>}
              {(!breakdown.skills?.score || breakdown.skills.score < 10) && <li>• Include a comprehensive skills section with relevant keywords</li>}
              {(!breakdown.experience?.score || breakdown.experience.score < 15) && <li>• Use action verbs and quantify achievements in work experience</li>}
              {(!breakdown.education?.score || breakdown.education.score < 8) && <li>• Include detailed education and certifications</li>}
            </ul>
          </div>
        )}

        {!resumeContent?.trim() && (
          <div className="text-center py-4">
            <BarChart3 className="h-8 w-8 text-primary/60 mx-auto mb-2" />
            <p className="text-sm text-primary">
              Add content to your resume to see your ATS compatibility score
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
