import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Circle, GraduationCap, Flame, Building2, Landmark, Trophy, Award, LandmarkIcon, MessageCircle, Mic } from "lucide-react";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments() || [];

  // 1. Weekly Prep Tracker Logic
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const weeklyAssessments = assessments.filter(
    (a) => new Date(a.createdAt) >= last7Days
  );

  const weeklyCount = weeklyAssessments.length;
  const weeklyScores = weeklyAssessments.map((a) => a.quizScore);
  const weeklyAvg = weeklyScores.length
    ? Math.round(weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length)
    : 0;

  // Weekly checklist items
  const hasTakenQuiz = weeklyCount > 0;
  const hasPassedHigh = weeklyScores.some(s => s >= 70);
  const hasMultiple = weeklyCount >= 2;

  let checklistScore = 0;
  if (hasTakenQuiz) checklistScore += 33;
  if (hasPassedHigh) checklistScore += 33;
  if (hasMultiple) checklistScore += 34;

  const companies = [
    {
      name: "Google",
      focus: "Data Structures, Algorithms, Googlyness, System Design",
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      tag: "Tech Giant"
    },
    {
      name: "Amazon",
      focus: "Leadership Principles, Coding, Scale Architecture",
      icon: <Flame className="h-5 w-5 text-amber-500" />,
      tag: "E-Commerce"
    },
    {
      name: "McKinsey & Co",
      focus: "Case Interviews, Market Sizing, Business Logic",
      icon: <Landmark className="h-5 w-5 text-emerald-500" />,
      tag: "Consulting"
    },
    {
      name: "Goldman Sachs",
      focus: "Finance Logic, Math, Algorithms, System Design",
      icon: <LandmarkIcon className="h-5 w-5 text-amber-600" />,
      tag: "Finance"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-muted/20 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-title flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Interview Preparation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Test your knowledge with company practice guides, salary negotiation simulators, and weekly trackers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link href="/interview/behavioral" className="w-full md:w-auto">
            <Button className="w-full md:w-auto gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white shadow-md">
              <Mic className="h-4 w-4" />
              Behavioral Mock (Voice)
            </Button>
          </Link>
          <Link href="/interview/negotiation" className="w-full md:w-auto">
            <Button className="w-full md:w-auto gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/95 text-white shadow-md">
              <MessageCircle className="h-4 w-4" />
              Salary Negotiator
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Diagnostic Charts, History, and Company Prep */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Chart */}
          <PerformanceChart assessments={assessments} />
          
          {/* Company-Specific Prep Library */}
          <Card className="border border-muted/50 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Prep Library
              </CardTitle>
              <CardDescription>
                Start a target test customized to the interview structure and values of leading firms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companies.map((comp) => (
                  <Card key={comp.name} className="border border-muted/40 hover:border-primary/30 transition-all bg-card/60">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-2">
                        {comp.icon}
                        <span className="font-bold text-sm sm:text-base">{comp.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] py-0.5 border-muted">
                        {comp.tag}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 pb-3 text-xs text-muted-foreground leading-normal">
                      <strong>Focus areas:</strong> {comp.focus}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/interview/mock?topic=${comp.name}%20Interview`} className="w-full">
                        <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs text-primary hover:bg-primary/5 border-primary/20">
                          Start Practice Test
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Quizzes List */}
          <QuizList assessments={assessments} />
        </div>

        {/* Right Column - Sidebar Widgets (Checklist, Statistics) */}
        <div className="space-y-8">
          
          {/* Weekly Prep Tracker */}
          <Card className="border border-muted/50 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
                Weekly Prep Checklist
              </CardTitle>
              <CardDescription className="text-xs">
                Maintain consistent activity to hit your goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              
              {/* Readiness Score Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground">Weekly Readiness Score</span>
                  <span className="text-primary font-bold">{checklistScore}%</span>
                </div>
                <Progress value={checklistScore} className="h-2 bg-muted" />
              </div>

              {/* Checklist list */}
              <div className="space-y-3 pt-2">
                
                {/* Rule 1 */}
                <div className="flex items-start gap-2.5 text-sm">
                  {hasTakenQuiz ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className={`font-medium ${hasTakenQuiz ? "line-through text-muted-foreground" : ""}`}>
                      Take a weekly mock test
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {weeklyCount} taken in past 7 days
                    </span>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="flex items-start gap-2.5 text-sm">
                  {hasPassedHigh ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className={`font-medium ${hasPassedHigh ? "line-through text-muted-foreground" : ""}`}>
                      Score above 70%
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Weekly Avg Score: {weeklyAvg}%
                    </span>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="flex items-start gap-2.5 text-sm">
                  {hasMultiple ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className={`font-medium ${hasMultiple ? "line-through text-muted-foreground" : ""}`}>
                      Complete multiple quizzes
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Target: at least 2 quizzes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <StatsCards assessments={assessments} />
          
        </div>
      </div>
    </div>
  );
}
