"use client";

import { useState } from "react";
import { generateColdEmail } from "@/actions/networking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Copy, Check, Send } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function NetworkingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    targetPerson: "",
    targetRole: "",
    targetCompany: "",
    tone: "Professional and direct",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToneChange = (value) => {
    setFormData((prev) => ({ ...prev, tone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetRole || !formData.targetCompany) {
      toast.error("Please provide at least a Target Role and Company.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const email = await generateColdEmail(formData);
      setResult(email);
      toast.success("Email generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          Cold Email Generator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Generate highly personalized, high-converting outreach emails leveraging your saved resume data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Outreach Details</CardTitle>
            <CardDescription>
              Who are you trying to connect with? We'll use this along with your resume to draft the perfect email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetPerson">Target Person's Name (Optional)</Label>
                <Input
                  id="targetPerson"
                  name="targetPerson"
                  placeholder="e.g. John Doe"
                  value={formData.targetPerson}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  name="targetRole"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.targetRole}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCompany">Target Company</Label>
                <Input
                  id="targetCompany"
                  name="targetCompany"
                  placeholder="e.g. Google, Stripe"
                  value={formData.targetCompany}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email Tone</Label>
                <Select value={formData.tone} onValueChange={handleToneChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional and direct">Professional & Direct</SelectItem>
                    <SelectItem value="Enthusiastic and friendly">Enthusiastic & Friendly</SelectItem>
                    <SelectItem value="Short and punchy">Short & Punchy</SelectItem>
                    <SelectItem value="Curious and inquisitive">Curious & Inquisitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Draft...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="h-full min-h-[500px] flex flex-col bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Generated Draft</CardTitle>
              <CardDescription>Review and copy your personalized email</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                {copied ? <Check className="h-4 w-4 text-emerald-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-6">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Mail className="h-16 w-16 text-muted-foreground" />
                <p>Your generated email draft will appear here.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your resume and drafting...</p>
              </div>
            )}

            {result && !loading && (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
