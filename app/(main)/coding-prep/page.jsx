"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProblemsByCategory } from "@/actions/coding-prep";
import { generateCategoryCheatsheet } from "@/actions/coding";
import { categories } from "@/data/neetcode150";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, CheckCircle2, Circle, ArrowRight, Loader2, FileCode2, Copy, Check, Download, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodingPrepDashboard() {
  const [solvedIds, setSolvedIds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spyai_solved_problems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cheatsheet States
  const [selectedCategory, setSelectedCategory] = useState("Arrays & Hashing");
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [generatingCheat, setGeneratingCheat] = useState(false);
  const [cheatsheetData, setCheatsheetData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await getProblemsByCategory();
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  const totalProblems = problems.length;
  const solvedCount = solvedIds.length;
  const progressPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const handleGenerateCheatsheet = async () => {
    setGeneratingCheat(true);
    try {
      let categoryProblems = [];
      if (selectedCategory !== "ALL") {
        categoryProblems = problems.filter(p => p.category === selectedCategory);
        if (categoryProblems.length === 0) throw new Error("No problems found in this category.");
      }
      
      const markdown = await generateCategoryCheatsheet(selectedCategory, selectedLanguage, categoryProblems);
      setCheatsheetData(markdown);
    } catch (err) {
      toast.error(err.message || "Failed to generate cheatsheet.");
    } finally {
      setGeneratingCheat(false);
    }
  };

  const handleCopyCheatsheet = () => {
    if (cheatsheetData) {
      navigator.clipboard.writeText(cheatsheetData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Cheatsheet copied to clipboard!");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!cheatsheetData) return;
    const blob = new Blob([cheatsheetData], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cheatsheet_${selectedCategory.replace(/ /g, "_")}_${selectedLanguage}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown downloaded!");
  };

  const handleDownloadPDF = async () => {
    if (!cheatsheetData) return;
    
    // We need to capture the rendered markdown div to convert to PDF
    const element = document.getElementById("cheatsheet-content");
    if (!element) return;
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       [15, 15, 15, 15],
        filename:     `cheatsheet_${selectedCategory.replace(/ /g, "_")}_${selectedLanguage}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'], avoid: ['h1', 'h2', 'h3', 'h4', 'pre', 'table', '.rounded-lg'] }
      };
      
      toast.info("Generating PDF... please wait.");
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading Problem Database...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-muted/20 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-title flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            Coding Prep (SPY AI Algo Coach)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Master Data Structures and Algorithms with our integrated AI Tutor and Code Execution environment.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-black text-primary">{progressPct}%</div>
          <div className="text-sm text-muted-foreground">{solvedCount} / {totalProblems} Solved</div>
        </div>
      </div>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
          <TabsTrigger value="problems">Problems List</TabsTrigger>
          <TabsTrigger value="cheatsheets">AI Cheatsheets</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="space-y-8">
          {categories.map(category => {
            const categoryProblems = problems.filter(p => p.category === category);
            if (categoryProblems.length === 0) return null;

            const solvedInCategory = categoryProblems.filter(p => solvedIds.includes(p.id)).length;

            return (
              <Card key={category} className="border border-muted/40 bg-card/60">
                <CardHeader className="pb-3 border-b border-muted/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{category}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {solvedInCategory} / {categoryProblems.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-muted/20">
                    {categoryProblems.map(problem => {
                      const isSolved = solvedIds.includes(problem.id);
                      return (
                        <Link 
                          key={problem.id} 
                          href={`/coding-prep/${problem.id}`}
                          className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {isSolved ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-semibold text-sm md:text-base">{problem.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                  problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
                                  problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
                                  'bg-red-500/10 text-red-400 border-red-400/20'
                                }`}>
                                  {problem.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                            Solve <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="cheatsheets">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode2 className="h-6 w-6 text-primary" />
                Category Cheatsheet Generator
              </CardTitle>
              <CardDescription>
                Select a category and language to instantly generate a comprehensive study guide containing boilerplate templates, core concepts, and hints for all problems in that category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL (Full 150 Questions)</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                      <SelectItem value="TypeScript">TypeScript</SelectItem>
                      <SelectItem value="Java">Java</SelectItem>
                      <SelectItem value="C++">C++</SelectItem>
                      <SelectItem value="C#">C#</SelectItem>
                      <SelectItem value="Go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateCheatsheet} 
                disabled={generatingCheat}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md font-medium text-base h-11 px-8"
              >
                {generatingCheat ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Study Guide...</>
                ) : (
                  "Generate Cheatsheet"
                )}
              </Button>

              {cheatsheetData && (
                <div className="mt-8 relative">
                  <div className="flex justify-end gap-3 mb-4">
                    <Button variant="outline" size="sm" onClick={handleDownloadMarkdown} className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm">
                      <FileText className="h-4 w-4" /> Download .MD
                    </Button>
                    <Button variant="default" size="sm" onClick={handleDownloadPDF} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCopyCheatsheet} className="gap-2 shadow-sm">
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-8 bg-card rounded-xl border border-muted shadow-sm ring-1 ring-black/5 dark:ring-white/5" id="cheatsheet-content">
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg shadow-sm !my-6 border border-muted/20"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={`${className} bg-muted/60 px-1.5 py-0.5 rounded-md text-sm font-mono text-primary`} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {cheatsheetData}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
