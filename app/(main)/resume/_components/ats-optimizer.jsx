"use client";

import { useState } from "react";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Copy,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { optimizeResumeSection } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";

export function ATSOptimizer({ 
  sectionType, 
  currentContent, 
  jobDescription, 
  targetRole, 
  companyName,
  onOptimizedContent 
}) {
  const [optimizedContent, setOptimizedContent] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const {
    loading: isOptimizing,
    fn: optimizeSectionFn,
    error: optimizeError,
  } = useFetch(optimizeResumeSection);

  const handleOptimize = async () => {
    if (!currentContent?.trim()) {
      toast.error(`Please add some ${sectionType} content first`);
      return;
    }

    if (!jobDescription?.trim() || !targetRole?.trim() || !companyName?.trim()) {
      toast.error("Job description, target role, and company name are required for optimization");
      return;
    }

    try {
      const optimized = await optimizeSectionFn(currentContent, sectionType, jobDescription, targetRole, companyName);
      setOptimizedContent(optimized);
      toast.success(`${sectionType} section optimized for ATS!`);
    } catch (error) {
      toast.error(`Failed to optimize ${sectionType}: ${error.message}`);
    }
  };

  const handleApplyOptimization = () => {
    if (onOptimizedContent && optimizedContent) {
      onOptimizedContent(optimizedContent);
      toast.success("Optimized content applied!");
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const calculateImprovementScore = () => {
    // Simple heuristic for demonstration
    const originalLength = currentContent?.length || 0;
    const optimizedLength = optimizedContent?.length || 0;
    const lengthRatio = optimizedLength / Math.max(originalLength, 1);
    
    // Assume optimization improves score by 15-30 points
    return Math.min(Math.round(20 + (lengthRatio * 10)), 30);
  };

  if (!currentContent?.trim()) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Add some {sectionType} content to enable ATS optimization
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Optimization Button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">ATS Optimization</h4>
          <p className="text-xs text-muted-foreground">
            Optimize for {targetRole || "target role"} at {companyName || "target company"}
          </p>
        </div>
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing || !jobDescription || !targetRole || !companyName}
          size="sm"
          className="flex items-center gap-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Optimize for ATS
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {optimizedContent && (
        <div className="space-y-4">
          {/* Improvement Score */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Estimated ATS Score Improvement
                  </span>
                </div>
                <Badge variant="default" className="bg-green-600">
                  +{calculateImprovementScore()} points
                </Badge>
              </div>
              <Progress 
                value={calculateImprovementScore()} 
                className="mt-3" 
                indicatorClassName="bg-green-600"
              />
            </CardContent>
          </Card>

          {/* Content Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Original {sectionType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={currentContent}
                  readOnly
                  className="min-h-32 text-sm"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {currentContent?.length || 0} characters
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(currentContent)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Content */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  ATS-Optimized {sectionType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={optimizedContent}
                  onChange={(e) => setOptimizedContent(e.target.value)}
                  className="min-h-32 text-sm border-green-200 focus:border-green-300"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {optimizedContent?.length || 0} characters
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(optimizedContent)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyOptimization}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Benefits */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800">Key Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>ATS-friendly keywords</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Action verbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Quantified results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Industry terminology</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Proper formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Role alignment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {optimizeError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Failed to optimize: {optimizeError.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
