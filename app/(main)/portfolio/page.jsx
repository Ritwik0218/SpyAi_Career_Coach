"use client";

import { useState } from "react";
import { generatePortfolio } from "@/actions/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Code, Download, Copy, Check, MonitorPlay, Palette } from "lucide-react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PortfolioPage() {
  const [loading, setLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("Minimalist & Clean");

  const handleGenerate = async () => {
    setLoading(true);
    setHtmlCode("");
    try {
      const code = await generatePortfolio(theme);
      setHtmlCode(code);
      toast.success("Portfolio generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded portfolio.html");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Code className="h-8 w-8 text-primary" />
          AI Portfolio Builder
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-3xl">
          Instantly generate a beautiful, responsive, single-page portfolio website using your saved resume data. The AI writes raw HTML and Tailwind CSS that you can copy, deploy, or host anywhere for free.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Design Configuration
              </CardTitle>
              <CardDescription>
                Choose an aesthetic for your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visual Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minimalist & Clean (White/Gray/Black)">Minimalist & Clean</SelectItem>
                    <SelectItem value="Dark Mode Developer (Dark Blue/Gray/Neon)">Dark Mode Developer</SelectItem>
                    <SelectItem value="Modern Startup (Vibrant Gradients)">Modern Startup</SelectItem>
                    <SelectItem value="Cyberpunk (Neon Pink/Cyan on Black)">Cyberpunk</SelectItem>
                    <SelectItem value="Corporate Executive (Navy/Gold/White)">Corporate Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-primary to-indigo-600">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Coding your website...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Generate Website
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {htmlCode && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-semibold text-primary">Deployment Ready!</p>
                <p className="text-xs text-muted-foreground">You can download this HTML file and drag-and-drop it directly into <strong>Netlify</strong>, <strong>Vercel</strong>, or <strong>GitHub Pages</strong> for free hosting in seconds.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview / Code */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[600px] flex flex-col border-white/10 shadow-xl overflow-hidden">
            {!htmlCode && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                <MonitorPlay className="h-16 w-16 opacity-50" />
                <p>Select a theme and click Generate to see your live portfolio preview.</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>AI is writing HTML and designing with Tailwind...</p>
                <p className="text-xs opacity-50">This usually takes about 10-15 seconds.</p>
              </div>
            )}

            {htmlCode && !loading && (
              <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="preview">Live Preview</TabsTrigger>
                    <TabsTrigger value="code">Raw Code</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                </div>
                
                <TabsContent value="preview" className="flex-1 m-0 p-0 relative bg-white">
                  {/* Iframe for isolated styling */}
                  <iframe 
                    srcDoc={htmlCode} 
                    className="absolute inset-0 w-full h-full border-0"
                    title="Portfolio Preview"
                    sandbox="allow-scripts"
                  />
                </TabsContent>
                
                <TabsContent value="code" className="flex-1 m-0 relative bg-[#1E1E1E]">
                  <div className="absolute inset-0 overflow-auto">
                    <SyntaxHighlighter 
                      language="html" 
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1.5rem', minHeight: '100%', background: 'transparent' }}
                      wrapLines={true}
                    >
                      {htmlCode}
                    </SyntaxHighlighter>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
