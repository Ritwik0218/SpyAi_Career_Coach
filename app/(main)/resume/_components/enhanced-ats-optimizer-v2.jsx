"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  BarChart3,
  Eye,
  FileText,
  Award,
  ArrowRight,
  Lightbulb,
  Star,
  FileDown,
  File,
  Wand2,
  Users,
  Brain,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyzeWithAI, generateOptimizedResume, generateATSKeywords } from "@/actions/resume-fast";
import useFetch from "@/hooks/use-fetch";

export function EnhancedATSOptimizer({ 
  resumeContent, 
  jobDescription, 
  targetRole, 
  companyName,
  onOptimizedResume,
  userName 
}) {
  const [optimizedContent, setOptimizedContent] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [activeTab, setActiveTab] = useState("optimize");
  const [jobDescriptionInput, setJobDescriptionInput] = useState(jobDescription || "");
  const [targetRoleInput, setTargetRoleInput] = useState(targetRole || "");
  const [companyNameInput, setCompanyNameInput] = useState(companyName || "");

  const {
    loading: isOptimizing,
    fn: optimizeResumeFn,
    data: optimizationResult,
    error: optimizationError,
  } = useFetch(generateOptimizedResume);

  const {
    loading: isAnalyzing,
    fn: analyzeResumeFn,
    data: analysisResult,
    error: analysisError,
  } = useFetch(analyzeWithAI);

  const {
    loading: isGeneratingKeywords,
    fn: generateKeywordsFn,
    data: keywordsResult,
    error: keywordsError,
  } = useFetch(generateATSKeywords);

  // Handle optimization result
  useEffect(() => {
    if (optimizationResult) {
      if (typeof optimizationResult === 'string') {
        setOptimizedContent(optimizationResult);
      } else {
        setOptimizedContent(optimizationResult.optimizedContent || optimizationResult.content || "");
        if (optimizationResult.atsScore) {
          setAtsScore(optimizationResult.atsScore);
        }
        if (optimizationResult.improvements) {
          setImprovements(optimizationResult.improvements);
        }
      }
      toast.success("Resume optimized successfully!");
    }
  }, [optimizationResult]);

  // Handle analysis result
  useEffect(() => {
    if (analysisResult) {
      if (typeof analysisResult === 'number') {
        setAtsScore(analysisResult);
      } else {
        setAtsScore(analysisResult.score || analysisResult.atsScore || 0);
        setRecommendations(analysisResult.recommendations || analysisResult.suggestions || []);
        if (analysisResult.improvements) {
          setImprovements(analysisResult.improvements);
        }
      }
      toast.success("ATS analysis completed!");
    }
  }, [analysisResult]);

  // Handle keywords result
  useEffect(() => {
    if (keywordsResult) {
      if (Array.isArray(keywordsResult)) {
        setKeywords(keywordsResult);
      } else {
        setKeywords(keywordsResult.keywords || keywordsResult.terms || []);
      }
      toast.success("Keywords generated successfully!");
    }
  }, [keywordsResult]);

  // Error handling with user-friendly messages
  useEffect(() => {
    if (optimizationError) {
      const errorMsg = optimizationError.message?.includes('timeout') 
        ? "Optimization timed out. Please try with a shorter resume."
        : optimizationError.message?.includes('quota')
        ? "Service temporarily unavailable. Please try again in a few minutes."
        : "Failed to optimize resume. Please try again.";
      toast.error(errorMsg);
      console.error("Optimization error:", optimizationError);
    }
  }, [optimizationError]);

  useEffect(() => {
    if (analysisError) {
      const errorMsg = analysisError.message?.includes('timeout')
        ? "Analysis timed out. Please try with a shorter resume."
        : analysisError.message?.includes('quota')
        ? "Service temporarily unavailable. Please try again in a few minutes."
        : "Failed to analyze resume. Please try again.";
      toast.error(errorMsg);
      console.error("Analysis error:", analysisError);
    }
  }, [analysisError]);

  useEffect(() => {
    if (keywordsError) {
      const errorMsg = keywordsError.message?.includes('timeout')
        ? "Keyword generation timed out. Please try again."
        : "Failed to generate keywords. Please try again.";
      toast.error(errorMsg);
      console.error("Keywords error:", keywordsError);
    }
  }, [keywordsError]);

  const handleOptimizeResume = async () => {
    if (!resumeContent?.trim()) {
      toast.error("Please add resume content first");
      return;
    }
    
    if (!targetRoleInput?.trim()) {
      toast.error("Please enter a target role");
      return;
    }

    try {
      await optimizeResumeFn({
        resumeContent,
        targetRole: targetRoleInput,
        companyName: companyNameInput,
        jobDescription: jobDescriptionInput,
      });
    } catch (error) {
      console.error("Optimization error:", error);
    }
  };

  const handleAnalyzeATS = async () => {
    if (!resumeContent?.trim()) {
      toast.error("Please add resume content first");
      return;
    }

    try {
      await analyzeResumeFn({
        resumeContent,
        jobDescription: jobDescriptionInput || "",
        targetRole: targetRoleInput || "",
      });
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!targetRoleInput?.trim()) {
      toast.error("Please enter a target role");
      return;
    }

    try {
      await generateKeywordsFn({
        targetRole: targetRoleInput,
        jobDescription: jobDescriptionInput || "",
        companyName: companyNameInput || "",
      });
    } catch (error) {
      console.error("Keywords error:", error);
    }
  };

  const handleApplyOptimization = () => {
    if (optimizedContent && onOptimizedResume) {
      onOptimizedResume(optimizedContent);
      toast.success("Optimized resume applied to your main resume!");
    } else {
      toast.error("No optimized content available");
    }
  };

  const downloadOptimizedPDF = async () => {
    if (!optimizedContent) {
      toast.error("No optimized resume available for download");
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary element with the optimized resume content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; margin-bottom: 10px;">${userName || 'Your Name'}</h1>
            <div style="margin-bottom: 20px; color: #059669; font-weight: bold;">ATS-Optimized Resume</div>
          </div>
          <div style="white-space: pre-wrap; line-height: 1.6;">${optimizedContent}</div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      document.body.removeChild(tempDiv);
      
      // Use canvas.toBlob() to avoid large string serialization
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imgData = reader.result;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            
            pdf.save('ats-optimized-resume.pdf');
            toast.success('ATS-optimized resume downloaded as PDF!');
            resolve();
          };
          reader.readAsDataURL(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const downloadOptimizedWord = async () => {
    if (!optimizedContent) {
      toast.error("No optimized resume available for download");
      return;
    }

    try {
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>ATS-Optimized Resume</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { text-align: center; margin-bottom: 10px; }
              .ats-badge { text-align: center; color: #059669; font-weight: bold; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .entry { margin-bottom: 15px; }
              .entry h3 { margin-bottom: 5px; }
              .entry p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>${userName || 'Your Name'}</h1>
            <div class="ats-badge">ATS-Optimized Resume</div>
            <div class="section">
              <div style="white-space: pre-wrap; line-height: 1.6;">${optimizedContent}</div>
            </div>
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ats-optimized-resume.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('ATS-optimized resume downloaded as Word document!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Job Context Input */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Job Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetRole" className="text-sm font-medium text-gray-700">
                Target Role *
              </Label>
              <Input
                id="targetRole"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                placeholder="e.g., Google"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
              Job Description
            </Label>
            <Textarea
              id="jobDescription"
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
              placeholder="Paste the job description here..."
              className="mt-1 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* ATS Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Keywords
          </TabsTrigger>
        </TabsList>

        {/* Optimize Tab */}
        <TabsContent value="optimize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Resume Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Our AI will optimize your resume using Google's Gemini AI to match the job requirements and improve ATS compatibility.
              </p>
              
              <Button 
                onClick={handleOptimizeResume}
                disabled={isOptimizing || !resumeContent?.trim() || !targetRoleInput?.trim()}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Optimizing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Optimize Resume with AI
                  </>
                )}
              </Button>

              {optimizedContent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Optimized Resume</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleApplyOptimization}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Apply to Resume
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={downloadOptimizedPDF}>
                            <FileDown className="h-4 w-4 mr-2" />
                            Download as PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={downloadOptimizedWord}>
                            <File className="h-4 w-4 mr-2" />
                            Download as Word
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {optimizedContent}
                    </pre>
                  </div>

                  {improvements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Key Improvements Made:</h4>
                      <ul className="space-y-1">
                        {improvements.map((improvement, index) => (
                          <li key={`improvement-${index}`} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                ATS Compatibility Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Analyze how well your resume performs against Applicant Tracking Systems (ATS).
              </p>
              
              <Button 
                onClick={handleAnalyzeATS}
                disabled={isAnalyzing || !resumeContent?.trim()}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze ATS Compatibility
                  </>
                )}
              </Button>

              {atsScore !== null && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-gray-800">
                        {atsScore}
                      </span>
                      <span className="text-lg text-gray-600">/100</span>
                    </div>
                    <div className={`text-lg font-semibold ${getScoreColor(atsScore)}`}>
                      {getScoreLevel(atsScore)}
                    </div>
                    <Progress 
                      value={atsScore} 
                      className="w-full"
                      style={{
                        '--progress-background': atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>

                  {recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Recommendations:</h3>
                      <div className="space-y-2">
                        {recommendations.map((rec, index) => (
                          <div key={`recommendation-${index}`} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Search className="h-5 w-5 text-blue-600" />
                Industry Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Get relevant keywords for your target role to improve ATS visibility.
              </p>
              
              <Button 
                onClick={handleGenerateKeywords}
                disabled={isGeneratingKeywords || !targetRoleInput?.trim()}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isGeneratingKeywords ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Keywords...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Generate Keywords
                  </>
                )}
              </Button>

              {keywords.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">
                    Recommended Keywords for {targetRoleInput}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={`keyword-${index}`} variant="secondary" className="bg-primary/10 text-primary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Tip: Incorporate these keywords naturally throughout your resume to improve ATS compatibility.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
