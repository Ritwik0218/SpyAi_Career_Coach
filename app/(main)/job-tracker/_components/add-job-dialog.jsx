"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createJobApplication } from "@/actions/job-tracker";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddJobDialog({ open, onOpenChange, onJobAdded }) {
  const [loading, setLoading] = useState(false);

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
    };

    try {
      const newJob = await createJobApplication(data);
      onJobAdded(newJob);
      toast.success("Job added successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" name="companyName" required placeholder="Google" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input id="jobTitle" name="jobTitle" required placeholder="Software Engineer" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Job Posting URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://careers.google.com/..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input id="salary" name="salary" placeholder="$120k - $150k" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Remote / SF" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select name="status" defaultValue="SAVED">
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

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
