"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateTailoredResume } from "@/actions/job-tracker";
import { toast } from "sonner";
import { Bot, Loader2, Copy, Check } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

export default function TailorResumeDialog({ open, onOpenChange, jobId }) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tailoredResume, setTailoredResume] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please provide a job description first.");
      return;
    }
    
    setLoading(true);
    setTailoredResume(null);

    try {
      const res = await generateTailoredResume(jobId, jobDescription);
      if (res.success) {
        setTailoredResume(res.tailoredResume);
        toast.success("Resume tailored successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to tailor resume");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tailoredResume) return;
    navigator.clipboard.writeText(tailoredResume);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTailoredResume(null);
    setJobDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) handleReset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Resume Tailor
          </DialogTitle>
          <DialogDescription>
            Paste the target Job Description below. Our AI will restructure your base resume to optimize for this role.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-[300px]">
          {!tailoredResume && !loading ? (
            <div className="space-y-3 h-full flex flex-col">
              <Label htmlFor="jd">Job Description</Label>
              <Textarea 
                id="jd" 
                placeholder="Paste the full job description here..." 
                className="flex-1 min-h-[250px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          ) : loading ? (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center space-y-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="animate-pulse">Analyzing Job Description & Restructuring Resume...</p>
            </div>
          ) : (
            <div className="space-y-4" data-color-mode="light">
               <div className="flex justify-between items-center bg-muted/30 p-2 rounded-t-lg border border-b-0">
                 <span className="text-sm font-medium px-2">Tailored Markdown Resume</span>
                 <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 gap-1">
                   {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                   {copied ? "Copied" : "Copy"}
                 </Button>
               </div>
               <div className="border rounded-b-lg overflow-hidden">
                 <MDEditor.Markdown source={tailoredResume} className="p-4" />
               </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          {!tailoredResume && !loading ? (
             <>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button onClick={handleGenerate} className="gap-2">
                 <Bot className="h-4 w-4" /> Generate
               </Button>
             </>
          ) : tailoredResume ? (
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
