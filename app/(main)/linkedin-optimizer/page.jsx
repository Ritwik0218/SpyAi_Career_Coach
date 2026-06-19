"use client";

import { useState, useEffect } from "react";
import { optimizeLinkedInProfile, getLinkedInAnalysis } from "@/actions/linkedin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Linkedin, CheckCircle, AlertTriangle, ChevronRight, FileText, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

export default function LinkedInOptimizerPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const savedAnalysis = await getLinkedInAnalysis();
        if (savedAnalysis) {
          setAnalysis(savedAnalysis);
        }
      } catch (err) {
        console.error("Failed to load saved analysis", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAnalysis();
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      toast.error("Please upload a valid PDF file.");
      setFile(null);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your LinkedIn profile PDF.");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (url) formData.append("url", url);

      const result = await optimizeLinkedInProfile(formData);
      setAnalysis(result);
      toast.success("Profile analyzed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to analyze profile.");
    } finally {
      setLoading(false);
    }
  };

  const ScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
          LinkedIn Optimizer Engine
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your LinkedIn profile PDF and let our AI optimize your headline, summary, and experience for recruiters and ATS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <Card className="lg:col-span-1 h-fit bg-card/50 backdrop-blur-sm border-white/5 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              Profile Details
            </CardTitle>
            <CardDescription>
              Provide your LinkedIn URL and the PDF export of your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">LinkedIn Profile URL (Optional)</Label>
                <Input
                  id="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Profile PDF *</Label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-black/20"
                  onClick={() => document.getElementById("pdf-upload").click()}
                >
                  <input
                    type="file"
                    id="pdf-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {file ? (
                      <>
                        <FileText className="h-10 w-10 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">Click to change file</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <span className="text-sm font-medium">Click to upload your profile</span>
                        <span className="text-xs text-muted-foreground">PDF export from LinkedIn</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <p>How to get your PDF:</p>
                  <ol className="list-decimal ml-4 space-y-1 mt-1">
                    <li>Go to your LinkedIn profile</li>
                    <li>Click the <strong>More</strong> button</li>
                    <li>Select <strong>Save to PDF</strong></li>
                  </ol>
                </div>
              </div>

              <Button type="submit" className="w-full font-bold" disabled={!file || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  "Optimize My Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {isFetching && (
            <Card className="h-full min-h-[400px] flex items-center justify-center bg-card/20 backdrop-blur-sm border-white/5">
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading your saved analysis...</p>
              </div>
            </Card>
          )}

          {!isFetching && !analysis && !loading && (
            <Card className="h-full min-h-[400px] flex items-center justify-center bg-card/20 backdrop-blur-sm border-white/5 border-dashed">
              <div className="text-center space-y-4 px-6 max-w-md">
                <div className="w-20 h-20 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0A66C2]/20 shadow-[0_0_30px_rgba(10,102,194,0.15)]">
                  <Bot className="h-10 w-10 text-[#0A66C2]" />
                </div>
                <h3 className="text-xl font-semibold">Ready to Optimize</h3>
                <p className="text-muted-foreground">
                  Upload your LinkedIn profile PDF and our AI will generate a tailored, section-by-section optimization report to boost your visibility to recruiters.
                </p>
              </div>
            </Card>
          )}

          {!isFetching && loading && (
            <Card className="h-full min-h-[400px] flex items-center justify-center bg-card/20 backdrop-blur-sm border-white/5">
              <div className="text-center space-y-6 max-w-md w-full px-8">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-t-2 border-[#0A66C2] animate-spin animation-delay-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Linkedin className="h-8 w-8 text-[#0A66C2]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold animate-pulse">Running Deep Analysis...</h3>
                  <p className="text-muted-foreground text-sm">Evaluating your headline, checking keyword density, and analyzing experience descriptions.</p>
                </div>
              </div>
            </Card>
          )}

          {!isFetching && analysis && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Card */}
              <Card className="bg-card/50 backdrop-blur-sm border-white/5 shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                <CardHeader>
                  <CardTitle>Profile Strength Score</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-white/10 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className={`${ScoreColor(analysis.overallScore)} stroke-current transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.overallScore / 100)}`}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-extrabold ${ScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">/ 100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {analysis.overallScore >= 80 ? "Stellar Profile!" : analysis.overallScore >= 60 ? "Good, but room to grow." : "Needs significant updates."}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Follow the actionable suggestions below to optimize your profile for better search rankings and recruiter conversion.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Headline */}
              <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" /> Headline Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="bg-black/30 p-3 rounded-md border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Current</span>
                    <p className="font-medium text-sm">{analysis.headline.current}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Feedback</span>
                    <div className="text-sm leading-relaxed text-gray-300 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&_strong]:text-white">
                      <ReactMarkdown>{analysis.headline.feedback}</ReactMarkdown>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">AI Suggestions</span>
                    <ul className="space-y-3">
                      {analysis.headline.suggestions.map((s, i) => (
                        <li key={`hl-${i}`} className="text-sm bg-primary/10 border border-primary/20 p-3 rounded-lg text-primary-foreground flex gap-3 items-start group">
                          <ChevronRight className="h-4 w-4 mt-1 shrink-0" />
                          <div className="flex-1 [&>p]:mb-1 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{s}</ReactMarkdown>
                          </div>
                          <button
                            onClick={() => handleCopy(s, `hl-${i}`)}
                            className="text-muted-foreground hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === `hl-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Summary / About
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Feedback</span>
                    <div className="text-sm leading-relaxed text-gray-300 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&_strong]:text-white">
                      <ReactMarkdown>{analysis.summary.feedback}</ReactMarkdown>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">AI Suggestions</span>
                    <ul className="space-y-3">
                      {analysis.summary.suggestions.map((s, i) => (
                        <li key={`sum-${i}`} className="text-sm bg-muted/50 p-3 rounded-lg border border-white/5 flex gap-3 items-start group">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                          <div className="flex-1 [&>p]:mb-1 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{s}</ReactMarkdown>
                          </div>
                          <button
                            onClick={() => handleCopy(s, `sum-${i}`)}
                            className="text-muted-foreground hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === `sum-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Experience & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" /> Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="text-sm text-gray-300 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white">
                      <ReactMarkdown>{analysis.experience.feedback}</ReactMarkdown>
                    </div>
                    <ul className="space-y-3 mt-4">
                      {analysis.experience.suggestions.map((s, i) => (
                        <li key={`exp-${i}`} className="text-sm flex gap-3 items-start group p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                          <div className="flex-1 text-muted-foreground [&>p]:mb-1 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{s}</ReactMarkdown>
                          </div>
                          <button
                            onClick={() => handleCopy(s, `exp-${i}`)}
                            className="text-muted-foreground hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === `exp-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" /> Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="text-sm text-gray-300 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white">
                      <ReactMarkdown>{analysis.skills.feedback}</ReactMarkdown>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      {analysis.skills.suggestions.map((s, i) => (
                        <div key={i} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white [&>p]:mb-1 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-white">
                          <ReactMarkdown>{s}</ReactMarkdown>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure icons used are imported
function Bot(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function Briefcase(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
