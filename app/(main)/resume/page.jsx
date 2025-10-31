"use client";

// This route relies on authenticated server actions (Clerk's auth) and
// dynamic data (DB). Force dynamic rendering so Next doesn't attempt to
// pre-render this route statically during the build, which causes
// `headers()` / `auth()` related errors.
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getResume } from "@/actions/resume-fast";
import ProfessionalResumeBuilder from "./_components/professional-resume-builder-v2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Zap, Loader2 } from "lucide-react";

function ResumeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 lg:mb-8">
            <div className="space-y-2 w-full sm:w-auto">
              <div className="h-6 sm:h-7 lg:h-8 w-48 sm:w-56 lg:w-64 bg-muted animate-pulse rounded" />
              <div className="h-4 sm:h-5 lg:h-6 w-64 sm:w-80 lg:w-96 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="h-9 sm:h-10 w-28 sm:w-32 bg-muted animate-pulse rounded" />
              <div className="h-9 sm:h-10 w-28 sm:w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="h-64 sm:h-80 lg:h-96 w-full bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const loadResume = async () => {
      try {
        const resumeData = await getResume();
        setResume(resumeData);
      } catch (err) {
        console.error("Resume load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || loading) {
    return <ResumeSkeleton />;
  }

  if (!isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Tabs - Mobile First */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 py-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Resume Builder</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <Link href="/resume/ats-analysis" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 border-border text-foreground hover:bg-muted transition-all duration-200">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm sm:text-base">ATS Analysis</span>
                <Badge className="ml-2 bg-success/10 text-success border-success/20 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  FREE
                </Badge>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Database Connection Issue</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              We're having trouble connecting to the database. This is likely temporary.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              If you're using Neon free tier, the database may have gone to sleep. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <ProfessionalResumeBuilder initialContent={resume?.content} />
      )}
    </div>
  );
}
