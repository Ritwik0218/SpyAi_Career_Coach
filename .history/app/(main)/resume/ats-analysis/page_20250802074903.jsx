"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ATSAnalyzer } from "../_components/ats-analyzer";
import { PageTransition } from "@/components/page-transition";
import { getResume } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { Loader2, FileText, BarChart3 } from "lucide-react";

export default function ATSAnalysisPage() {
  const [currentResume, setCurrentResume] = useState("");

  const {
    loading: isLoadingResume,
    fn: getResumeFn,
    data: resumeData,
  } = useFetch(getResume);

  useEffect(() => {
    getResumeFn();
  }, []);

  useEffect(() => {
    if (resumeData?.content) {
      setCurrentResume(resumeData.content);
    }
  }, [resumeData]);

  const handleResumeUpdate = (optimizedResume) => {
    setCurrentResume(optimizedResume);
  };

  if (isLoadingResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <Link href="/resume">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Builder
          </Button>
        </Link>
        <div className="text-muted-foreground">|</div>
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          <span className="font-medium">ATS Analysis</span>
        </div>
      </div>

      <ATSAnalyzer 
        currentResume={currentResume}
        onResumeUpdate={handleResumeUpdate}
      />
    </div>
  );
}
