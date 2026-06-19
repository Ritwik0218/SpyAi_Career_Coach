"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { generateCareerSyllabus } from "@/actions/dashboard";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function CareerBridgePage() {
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      toast.error("Please enter a target role.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateCareerSyllabus(targetRole);
      setSyllabus(data);
      toast.success("Syllabus generated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to generate syllabus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6 max-w-4xl">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/dashboard">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-title">Career Bridge</h1>
          <p className="text-muted-foreground mt-2">
            Generate a custom 4-week learning syllabus to transition into your dream role.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Target Role Setup
          </CardTitle>
          <CardDescription>
            We will compare your current skills and experience against the target role to generate a gap analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">What role are you trying to transition into?</Label>
              <Input 
                id="targetRole" 
                placeholder="e.g. Fullstack Developer, Product Manager, UX Designer..." 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !targetRole.trim()} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Skills...
                </>
              ) : (
                "Generate Syllabus"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {syllabus && (
        <Card className="mt-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Your Custom Learning Roadmap</CardTitle>
            <CardDescription>Follow this 4-week plan to bridge your skill gap.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown>{syllabus}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
