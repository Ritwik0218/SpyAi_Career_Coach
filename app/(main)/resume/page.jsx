import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import { RefreshButton } from "./_components/refresh-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition";
import { BarChart3, FileText, Zap } from "lucide-react";

export default async function ResumePage() {
  let resume = null;
  let error = null;

  try {
    resume = await getResume();
  } catch (err) {
    console.error("Database connection error:", err);
    error = err.message;
  }

  return (
    <PageTransition className="container mx-auto py-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          <span className="font-medium">Resume Builder</span>
        </div>
        <div className="text-muted-foreground">|</div>
        <Link href="/resume/ats-analysis">
          <Button variant="outline" className="flex items-center gap-2 relative">
            <BarChart3 className="h-4 w-4" />
            ATS Analysis
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              FREE
            </Badge>
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">Database Connection Issue</h2>
            <p className="text-muted-foreground mb-4">
              We're having trouble connecting to the database. This is likely temporary.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              If you're using Neon free tier, the database may have gone to sleep. Please try refreshing the page.
            </p>
            <RefreshButton />
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ResumeBuilder initialContent={resume?.content} />
      )}
    </PageTransition>
  );
}
