"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, ExternalLink, Bot, Briefcase, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TailorResumeDialog from "./tailor-resume-dialog";

const statusColors = {
  SAVED: "border-l-slate-500",
  APPLIED: "border-l-blue-500",
  INTERVIEWING: "border-l-amber-500",
  OFFERED: "border-l-emerald-500",
  REJECTED: "border-l-rose-500",
};

export default function JobCard({ job }) {
  const [isTailoring, setIsTailoring] = useState(false);

  return (
    <>
      <Card className={`bg-card/90 backdrop-blur-sm shadow-sm border-y-border border-r-border border-l-4 ${statusColors[job.status] || "border-l-border"} hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}>
      <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0 gap-2">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm font-semibold truncate" title={job.jobTitle}>
            {job.jobTitle}
          </CardTitle>
          <div className="flex items-center text-xs text-muted-foreground mt-1 font-medium truncate" title={job.companyName}>
            <Briefcase className="h-3 w-3 mr-1 shrink-0" />
            <span className="truncate">{job.companyName}</span>
          </div>
        </div>
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors ml-2 shrink-0">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardHeader>
      
      <CardContent className="p-3 pt-1">
        <div className="flex flex-col gap-1.5 mt-2">
          {job.salary && (
            <div className="flex items-center text-xs text-muted-foreground" title={job.salary}>
              <DollarSign className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
          {job.location && (
            <div className="flex items-center text-xs text-muted-foreground" title={job.location}>
              <MapPin className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.appliedDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1.5 shrink-0" />
              <span>Applied: {format(new Date(job.appliedDate), "MMM d, yyyy")}</span>
            </div>
          )}
          {/* Attention / Follow-up Logic */}
          {(() => {
            let attentionMessage = null;
            if (job.followUpDate) {
              const followUpDate = new Date(job.followUpDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              if (followUpDate < today) {
                attentionMessage = "Follow up overdue!";
              } else if (followUpDate.toDateString() === today.toDateString()) {
                attentionMessage = "Follow up today!";
              }
            } else if (job.status === "APPLIED" && job.appliedDate) {
              const daysSinceApplied = Math.floor((new Date() - new Date(job.appliedDate)) / (1000 * 60 * 60 * 24));
              if (daysSinceApplied >= 7) {
                attentionMessage = `Follow up needed (>7 days)`;
              }
            }
            
            if (!attentionMessage) return null;
            
            return (
              <div className="flex items-center text-xs text-rose-400 font-medium mt-1 bg-rose-500/10 w-fit px-1.5 py-0.5 rounded-sm">
                <AlertCircle className="h-3 w-3 mr-1 shrink-0" />
                <span>{attentionMessage}</span>
              </div>
            );
          })()}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 border-t border-muted/20 flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-[10px] h-7 gap-1 border-primary/50 text-primary hover:bg-primary/10" 
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsTailoring(true);
          }}
        >
          <Bot className="h-3 w-3" /> Tailor Resume
        </Button>
      </CardFooter>
    </Card>

    {isTailoring && (
      <TailorResumeDialog 
        open={isTailoring} 
        onOpenChange={setIsTailoring} 
        jobId={job.id} 
      />
    )}
    </>
  );
}
