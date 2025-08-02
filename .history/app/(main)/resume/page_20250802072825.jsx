import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Zap } from "lucide-react";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
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

      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
