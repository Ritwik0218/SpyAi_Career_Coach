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
    if (contactScore >= 12) {
      scoreInsights.push({ type: "good", text: "Complete contact information provided" });
      scoreBreakdown.contact = { score: contactScore, max: 15, status: "good" };
    } else if (contactScore >= 7) {
      scoreInsights.push({ type: "warning", text: "Missing some contact information (LinkedIn recommended)" });
      scoreBreakdown.contact = { score: contactScore, max: 15, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Critical contact information missing" });
      scoreBreakdown.contact = { score: contactScore, max: 15, status: "error" };
    }

    // 3. Professional Summary/Objective (15 points)
    const hasSummary = /summary|objective|profile|about/i.test(content);
    const summaryLength = content.match(/summary[\s\S]*?(?=##|$)/i)?.[0]?.length || 0;
    
    let summaryScore = 0;
    if (hasSummary && summaryLength > 200) {
      summaryScore = 15;
      scoreInsights.push({ type: "good", text: "Professional summary section present and detailed" });
      scoreBreakdown.summary = { score: 15, max: 15, status: "good" };
    } else if (hasSummary) {
      summaryScore = 8;
      scoreInsights.push({ type: "warning", text: "Professional summary could be more detailed" });
      scoreBreakdown.summary = { score: 8, max: 15, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Missing professional summary section" });
      scoreBreakdown.summary = { score: 0, max: 15, status: "error" };
    }
    totalScore += summaryScore;

    // 4. Skills Section (15 points)
    const hasSkills = /skills?|technologies|competencies/i.test(content);
    const skillsKeywords = (content.match(/\b(javascript|python|react|node|sql|aws|docker|git|agile|scrum|project management|leadership|communication|problem solving|analytical|teamwork)\b/gi) || []).length;
    
    let skillsScore = 0;
    if (hasSkills && skillsKeywords >= 8) {
      skillsScore = 15;
      scoreInsights.push({ type: "good", text: `Skills section with ${skillsKeywords} relevant keywords` });
      scoreBreakdown.skills = { score: 15, max: 15, status: "good" };
    } else if (hasSkills && skillsKeywords >= 4) {
      skillsScore = 10;
      scoreInsights.push({ type: "warning", text: "Skills section present but could include more keywords" });
      scoreBreakdown.skills = { score: 10, max: 15, status: "warning" };
    } else if (hasSkills) {
      skillsScore = 5;
      scoreInsights.push({ type: "warning", text: "Skills section lacks relevant keywords" });
      scoreBreakdown.skills = { score: 5, max: 15, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Missing skills section" });
      scoreBreakdown.skills = { score: 0, max: 15, status: "error" };
    }
    totalScore += skillsScore;

    // 5. Work Experience (20 points)
    const hasExperience = /experience|work|employment|career/i.test(content);
    const experienceEntries = (content.match(/\b(company|position|role|job|worked|developed|managed|led|implemented|achieved|increased|decreased|improved)\b/gi) || []).length;
    
    let experienceScore = 0;
    if (hasExperience && experienceEntries >= 15) {
      experienceScore = 20;
      scoreInsights.push({ type: "good", text: "Comprehensive work experience with action verbs" });
      scoreBreakdown.experience = { score: 20, max: 20, status: "good" };
    } else if (hasExperience && experienceEntries >= 8) {
      experienceScore = 12;
      scoreInsights.push({ type: "warning", text: "Work experience section could be more detailed" });
      scoreBreakdown.experience = { score: 12, max: 20, status: "warning" };
    } else if (hasExperience) {
      experienceScore = 6;
      scoreInsights.push({ type: "warning", text: "Work experience lacks detail and action verbs" });
      scoreBreakdown.experience = { score: 6, max: 20, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Missing work experience section" });
      scoreBreakdown.experience = { score: 0, max: 20, status: "error" };
    }
    totalScore += experienceScore;

    // 6. Education (10 points)
    const hasEducation = /education|degree|university|college|certification|diploma/i.test(content);
    const educationDetails = (content.match(/\b(bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|certification|certified)\b/gi) || []).length;
    
    let educationScore = 0;
    if (hasEducation && educationDetails >= 2) {
      educationScore = 10;
      scoreInsights.push({ type: "good", text: "Education section with detailed qualifications" });
      scoreBreakdown.education = { score: 10, max: 10, status: "good" };
    } else if (hasEducation) {
      educationScore = 6;
      scoreInsights.push({ type: "warning", text: "Education section could include more details" });
      scoreBreakdown.education = { score: 6, max: 10, status: "warning" };
    } else {
      scoreInsights.push({ type: "error", text: "Missing education section" });
      scoreBreakdown.education = { score: 0, max: 10, status: "error" };
    }
    totalScore += educationScore;

    // 7. Formatting and ATS Compatibility (5 points)
    const hasHeaders = (content.match(/##\s/g) || []).length;
    const hasProperStructure = hasHeaders >= 3;
    
    let formattingScore = 0;
    if (hasProperStructure) {
      formattingScore = 5;
      scoreInsights.push({ type: "good", text: "Well-structured with clear section headers" });
      scoreBreakdown.formatting = { score: 5, max: 5, status: "good" };
    } else {
      scoreInsights.push({ type: "warning", text: "Resume structure could be improved" });
      scoreBreakdown.formatting = { score: 2, max: 5, status: "warning" };
      formattingScore = 2;
    }
    totalScore += formattingScore;

    setScore(Math.min(100, totalScore));
    setInsights(scoreInsights);
    setBreakdown(scoreBreakdown);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Poor";
    return "Needs Major Improvement";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
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
    <Card className="w-full border-0 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          ATS Compatibility Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-lg font-medium text-gray-600 mb-4">
            {getScoreLabel(score)}
          </div>
          <div className="relative">
            <Progress 
              value={score} 
              className="h-4 bg-gray-200"
            />
            <div 
              className={`absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Score Breakdown */}
        {Object.keys(breakdown).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Score Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(breakdown).map(([category, data]) => (
                <div key={category} className="bg-white/80 p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(data.status)}
                      <span className="text-sm font-medium capitalize">
                        {category === 'contact' ? 'Contact Info' : 
                         category === 'summary' ? 'Summary' :
                         category === 'skills' ? 'Skills' :
                         category === 'experience' ? 'Experience' :
                         category === 'education' ? 'Education' :
                         category === 'formatting' ? 'Format' :
                         category === 'length' ? 'Length' : category}
                      </span>
                    </div>
                    <Badge variant={data.status === 'good' ? 'default' : data.status === 'warning' ? 'secondary' : 'destructive'}>
                      {data.score}/{data.max}
                    </Badge>
                  </div>
                  <Progress 
                    value={(data.score / data.max) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Key Insights
            </h4>
            <div className="space-y-2">
              {insights.slice(0, 6).map((insight, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    insight.type === "good" 
                      ? "bg-green-50 border border-green-200" 
                      : insight.type === "warning"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {insight.type === "good" && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {insight.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  {insight.type === "error" && (
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm text-gray-700">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {score < 80 && (
          <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Improvement Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {score < 60 && <li>• Ensure all contact information is complete</li>}
              {(!breakdown.summary?.score || breakdown.summary.score < 10) && <li>• Add a compelling professional summary</li>}
              {(!breakdown.skills?.score || breakdown.skills.score < 10) && <li>• Include a comprehensive skills section with relevant keywords</li>}
              {(!breakdown.experience?.score || breakdown.experience.score < 15) && <li>• Use action verbs and quantify achievements in work experience</li>}
              {(!breakdown.education?.score || breakdown.education.score < 8) && <li>• Include detailed education and certifications</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
