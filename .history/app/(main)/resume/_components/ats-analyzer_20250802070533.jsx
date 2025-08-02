"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Upload, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  Award,
  Eye,
  ThumbsUp,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  analyzeResumeATS, 
  optimizeResumeSection, 
  generateATSKeywords,
  generateOptimizedResume 
} from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { ATSTips } from "./ats-tips";
import { extractTextFromFile } from "@/lib/text-extraction";

export function ATSAnalyzer({ currentResume, onResumeUpdate }) {
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [uploadedResume, setUploadedResume] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [activeOptimization, setActiveOptimization] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);

  const {
    loading: isAnalyzing,
    fn: analyzeResumeFn,
    error: analysisError,
  } = useFetch(analyzeResumeATS);

  const {
    loading: isOptimizing,
    fn: optimizeSectionFn,
    error: optimizeError,
  } = useFetch(optimizeResumeSection);

  const {
    loading: isGeneratingKeywords,
    fn: generateKeywordsFn,
    error: keywordsError,
  } = useFetch(generateATSKeywords);

  const {
    loading: isGeneratingOptimized,
    fn: generateOptimizedResumeFn,
    error: optimizedError,
  } = useFetch(generateOptimizedResume);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    const allowedExtensions = ['.txt', '.pdf', '.docx', '.doc'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error("Please upload a .txt, .pdf, or .docx file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsExtracting(true);
    toast.info("📄 Extracting text from file...");

    try {
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText.trim()) {
        toast.error("No text content found in the file");
        return;
      }
      
      setUploadedResume(extractedText);
      toast.success(`✅ Resume extracted successfully! (${extractedText.length} characters)`);
    } catch (error) {
      console.error('File extraction error:', error);
      toast.error(`❌ ${error.message || "Failed to extract text from file"}`);
    } finally {
      setIsExtracting(false);
      // Reset the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  const handleAnalyze = async () => {
    const resumeToAnalyze = uploadedResume || currentResume;
    
    if (!resumeToAnalyze?.trim()) {
      toast.error("Please provide a resume to analyze");
      return;
    }
    
    if (!jobDescription?.trim()) {
      toast.error("Please provide a job description");
      return;
    }
    
    if (!targetRole?.trim()) {
      toast.error("Please specify the target role");
      return;
    }

    if (!companyName?.trim()) {
      toast.error("Please specify the company name");
      return;
    }

    try {
      setAnalysisProgress(25);
      toast.info("Starting ATS analysis...");
      
      setAnalysisProgress(50);
      const [analysis, keywordData] = await Promise.all([
        analyzeResumeFn(resumeToAnalyze, jobDescription, targetRole, companyName),
        generateKeywordsFn(jobDescription, targetRole, resumeToAnalyze, companyName)
      ]);
      
      setAnalysisProgress(75);
      setAnalysisResult(analysis);
      setKeywords(keywordData);
      setAnalysisProgress(100);
      toast.success("ATS analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze resume: " + error.message);
    } finally {
      setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const handleOptimizeSection = async (sectionType, currentContent) => {
    if (!jobDescription || !targetRole || !companyName) {
      toast.error("Please provide job description, target role, and company name first");
      return;
    }

    setActiveOptimization(sectionType);
    try {
      const optimized = await optimizeSectionFn(currentContent, sectionType, jobDescription, targetRole, companyName);
      toast.success(`${sectionType} section optimized!`);
      return optimized;
    } catch (error) {
      toast.error(`Failed to optimize ${sectionType}: ${error.message}`);
    } finally {
      setActiveOptimization(null);
    }
  };

  const handleGenerateOptimizedResume = async () => {
    const resumeToOptimize = uploadedResume || currentResume;
    
    if (!resumeToOptimize?.trim() || !jobDescription?.trim() || !targetRole?.trim() || !companyName?.trim()) {
      toast.error("Please provide resume, job description, target role, and company name");
      return;
    }

    try {
      const optimizedResume = await generateOptimizedResumeFn(resumeToOptimize, jobDescription, targetRole, companyName);
      if (onResumeUpdate) {
        onResumeUpdate(optimizedResume);
      }
      toast.success("Resume fully optimized for ATS!");
    } catch (error) {
      toast.error("Failed to generate optimized resume: " + error.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            🎉 100% FREE
          </Badge>
        </div>
        <h2 className="text-3xl font-bold gradient-title flex items-center justify-center gap-2">
          <BarChart3 className="h-8 w-8" />
          ATS Resume Analyzer
        </h2>
        <p className="text-muted-foreground">
          Get your resume ATS-ready and achieve a 90+ compatibility score - completely FREE!
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Resume Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Resume (Optional)</label>
              <Input
                type="file"
                accept=".txt,.docx,.doc"
                onChange={handleFileUpload}
                disabled={isExtracting}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                📄 Upload .txt or .docx file (max 10MB) - completely FREE! (PDF support coming soon)
              </p>
            </div>
            
            {isExtracting && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting text from file...
                </p>
              </div>
            )}
            
            {uploadedResume && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Resume uploaded successfully
                </p>
              </div>
            )}
            
            {!uploadedResume && currentResume && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Using your current resume builder content
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Job Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Role *</label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Marketing Manager"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name *</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Google, Microsoft, Startup Inc."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description *</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="h-32"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ATS Tips during analysis */}
      <ATSTips isAnalyzing={isAnalyzing || isGeneratingKeywords} />

      {/* Analysis Progress */}
      {analysisProgress > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Analyzing Resume...</span>
                <span className="text-sm text-blue-600">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || isGeneratingKeywords}
          className="flex items-center gap-2"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              Analyze ATS Score
            </>
          )}
        </Button>

        {analysisResult && (
          <Button
            onClick={handleGenerateOptimizedResume}
            disabled={isGeneratingOptimized}
            variant="default"
            className="flex items-center gap-2"
            size="lg"
          >
            {isGeneratingOptimized ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Optimized Resume
              </>
            )}
          </Button>
        )}
      </div>

      {/* Results Section */}
      {analysisResult && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">Section Analysis</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ATS Score */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Award className="h-5 w-5" />
                    ATS Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.atsScore)}`}>
                    {analysisResult.atsScore}
                  </div>
                  <Progress value={analysisResult.atsScore} className="mt-4" />
                  <Badge variant={getScoreBadgeVariant(analysisResult.atsScore)} className="mt-2">
                    {analysisResult.atsScore >= 80 ? "Excellent" : 
                     analysisResult.atsScore >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </CardContent>
              </Card>

              {/* Keyword Match */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Target className="h-5 w-5" />
                    Keyword Match
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {analysisResult.keywordAnalysis.keywordDensity}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {analysisResult.keywordAnalysis.matchedKeywords.length} matched keywords
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {analysisResult.keywordAnalysis.missingKeywords.length} missing keywords
                  </p>
                </CardContent>
              </Card>

              {/* Industry Ranking */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Industry Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {analysisResult.industryBenchmark.yourRanking}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Avg: {analysisResult.industryBenchmark.averageScore}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Top: {analysisResult.industryBenchmark.topPerformerScore}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Overall Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Overall Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {analysisResult.overallAssessment}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section Analysis Tab */}
          <TabsContent value="sections" className="space-y-4">
            {Object.entries(analysisResult.sectionAnalysis).map(([section, data]) => (
              <Card key={section}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getScoreBadgeVariant(data.score)}>
                        {data.score}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOptimizeSection(section, "")}
                        disabled={activeOptimization === section}
                      >
                        {activeOptimization === section ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Optimize
                      </Button>
                    </div>
                  </div>
                  <Progress value={data.score} className="w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4" />
                        Issues Found
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {data.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-green-600 flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-4 w-4" />
                      Suggestions
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {data.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-4">
            {keywords && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Matched Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordAnalysis.matchedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordAnalysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Keyword Categories */}
                {Object.entries(keywords).map(([category, keywordList]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {keywordList.map((keyword, index) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.immediate.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Short-term Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-600 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Short-term
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.shortTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Long-term Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Long-term
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.longTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
