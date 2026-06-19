import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BehavioralQuiz from "../_components/behavioral-quiz";
import { Suspense } from "react";

export default function BehavioralMockInterviewPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-6xl font-bold gradient-title">Behavioral Interview</h1>
          <p className="text-muted-foreground">
            Practice your soft skills with voice-to-text AI analysis
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading Interview...</div>}>
        <BehavioralQuiz />
      </Suspense>
    </div>
  );
}
