"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedATSOptimizer } from "../_components/enhanced-ats-optimizer-v2";
import { QuickATSScore } from "../_components/quick-ats-score-v2";
import { getResume } from "@/actions/resume-fast";
import useFetch from "@/hooks/use-fetch";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { entriesToMarkdown } from "@/app/lib/helper";
import { 
  Loader2, FileText, BarChart3, ArrowLeft, Zap, Target, 
  TrendingUp, Shield, Award, Sparkles, Brain, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

function ATSAnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-6 w-px bg-border" />
            <div className="h-8 w-40 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="lg:col-span-8">
            <div className="h-96 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ATSAnalysisPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [currentResume, setCurrentResume] = useState("");
  const [activeTab, setActiveTab] = useState("score");

  const {
    loading: isLoadingResume,
    fn: getResumeFn,
    data: resumeData,
  } = useFetch(getResume);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    getResumeFn();
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (resumeData?.content) {
      const resumeMarkdown = typeof resumeData.content === 'object' 
        ? entriesToMarkdown(resumeData.content)
        : resumeData.content;
      setCurrentResume(resumeMarkdown);
    }
  }, [resumeData]);

  const handleOptimizedResume = (optimizedContent) => {
    setCurrentResume(optimizedContent);
  };

  if (!isLoaded || isLoadingResume) {
    return <ATSAnalysisSkeleton />;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Premium Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/resume">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-muted transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Resume Builder
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <div className="p-2 bg-primary rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-title">
                      ATS Analysis Pro
                    </h1>
                    <p className="text-sm text-muted-foreground">AI-Powered Resume Optimization</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Badge className="bg-muted text-foreground border font-medium">
                <Sparkles className="h-3 w-3 mr-1" />
                FREE Analysis
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                <Brain className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold gradient-title mb-3">
            Boost Your Resume Success Rate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant ATS compatibility insights and AI-powered recommendations to land more interviews
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted">
            <TabsTrigger 
              value="score" 
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Score
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Optimize
            </TabsTrigger>
            <TabsTrigger 
              value="guide" 
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-8"
            >
                {/* ATS Score Card */}
                <div className="lg:col-span-5">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <QuickATSScore resumeContent={currentResume} />
                  </motion.div>
                  
                  {/* Quick Stats */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6"
                  >
                    <Card className="shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-primary">87%</div>
                            <div className="text-sm text-muted-foreground">Keyword Match</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-success">92%</div>
                            <div className="text-sm text-muted-foreground">Format Score</div>
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">A+</div>
                          <div className="text-sm text-muted-foreground">Overall Grade</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Insights Panel */}
                <div className="lg:col-span-7">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="shadow-lg h-full">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Brain className="h-6 w-6 text-primary" />
                          AI Insights & Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Strengths */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-success flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Strengths
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-lg">
                              <div className="w-2 h-2 bg-success rounded-full" />
                              Professional format with clear sections
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-lg">
                              <div className="w-2 h-2 bg-success rounded-full" />
                              Good use of action verbs and quantified achievements
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-lg">
                              <div className="w-2 h-2 bg-success rounded-full" />
                              ATS-friendly formatting and structure
                            </div>
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-warning flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Areas for Improvement
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-lg">
                              <div className="w-2 h-2 bg-warning rounded-full" />
                              Add more industry-specific keywords
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-lg">
                              <div className="w-2 h-2 bg-warning rounded-full" />
                              Include more quantified achievements
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4 border-t border-border">
                          <Button 
                            onClick={() => setActiveTab("optimize")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Optimize My Resume
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="optimize">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      AI-Powered Resume Optimization
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Get personalized recommendations and optimize your resume for specific job roles
                    </p>
                  </CardHeader>
                  <CardContent>
                    <EnhancedATSOptimizer
                      resumeContent={currentResume}
                      onOptimizedResume={handleOptimizedResume}
                      userName={user?.fullName}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="guide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      ATS Optimization Guide
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Learn how to make your resume ATS-friendly and increase your interview chances
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary rounded-lg">
                            <Target className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <h4 className="font-semibold text-foreground">1. Check Your Score</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Review your current ATS compatibility score and identify specific areas that need improvement for better visibility.
                        </p>
                      </div>

                      <div className="space-y-3 p-4 bg-success/5 rounded-lg border border-success/20">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-success rounded-lg">
                            <FileText className="h-4 w-4 text-success-foreground" />
                          </div>
                          <h4 className="font-semibold text-foreground">2. Add Job Context</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enter the target role and job description for personalized optimization recommendations tailored to your goals.
                        </p>
                      </div>

                      <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-secondary">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-accent rounded-lg">
                            <Sparkles className="h-4 w-4 text-accent-foreground" />
                          </div>
                          <h4 className="font-semibold text-foreground">3. Optimize & Export</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Use AI-powered optimization to enhance your resume and download ATS-friendly versions in multiple formats.
                        </p>
                      </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-muted p-6 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Pro Tips for ATS Success
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Use standard section headings (Experience, Education, Skills)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Include relevant keywords from the job description</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Use simple, readable fonts (Arial, Calibri, Times)</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Quantify achievements with numbers and percentages</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Avoid images, charts, and complex formatting</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Save as both PDF and Word formats</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
