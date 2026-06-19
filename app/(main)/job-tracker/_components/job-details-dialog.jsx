"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateJobDetails, deleteJobApplication } from "@/actions/job-tracker";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function JobDetailsDialog({ open, onOpenChange, job, onJobUpdated, onJobDeleted }) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      companyName: formData.get("companyName"),
      jobTitle: formData.get("jobTitle"),
      url: formData.get("url"),
      salary: formData.get("salary"),
      location: formData.get("location"),
      status: formData.get("status"),
      notes: formData.get("notes"),
      appliedDate: formData.get("appliedDate") || null,
      interviewDate: formData.get("interviewDate") || null,
      contactName: formData.get("contactName"),
      contactEmail: formData.get("contactEmail"),
      followUpDate: formData.get("followUpDate") || null,
    };

    try {
      const updatedJob = await updateJobDetails(job.id, data);
      onJobUpdated(updatedJob);
      toast.success("Job updated successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to update job details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await deleteJobApplication(job.id);
      onJobDeleted(job.id);
      toast.success("Job deleted");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Job Details: {job.companyName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" name="companyName" required defaultValue={job.companyName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input id="jobTitle" name="jobTitle" required defaultValue={job.jobTitle} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={job.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAVED">Saved</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                  <SelectItem value="OFFERED">Offered</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input id="salary" name="salary" defaultValue={job.salary} placeholder="$120k - $150k" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Job Posting URL</Label>
            <Input id="url" name="url" type="url" defaultValue={job.url} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={job.location} placeholder="Remote / SF" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input id="appliedDate" name="appliedDate" type="datetime-local" defaultValue={formatDateForInput(job.appliedDate)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Input id="interviewDate" name="interviewDate" type="datetime-local" defaultValue={formatDateForInput(job.interviewDate)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name (Recruiter)</Label>
              <Input id="contactName" name="contactName" defaultValue={job.contactName} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" defaultValue={job.contactEmail} placeholder="jane@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input id="followUpDate" name="followUpDate" type="datetime-local" defaultValue={formatDateForInput(job.followUpDate)} />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              defaultValue={job.notes} 
              placeholder="Add interview notes, research about the company, or follow-up reminders..."
              className="min-h-[100px]" 
            />
          </div>

          <DialogFooter className="pt-6 flex justify-between sm:justify-between w-full flex-row-reverse">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
