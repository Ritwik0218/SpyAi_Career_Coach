"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { 
  Sparkles, 
  PlusCircle, 
  X, 
  Pencil, 
  Save, 
  Loader2, 
  Plus,
  Trash2,
  Edit,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  ExternalLink
} from "lucide-react";
import { improveWithAI } from "@/actions/resume-fast";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  } catch {
    return dateString;
  }
};

const getEntryIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "experience":
    case "work experience":
      return <Briefcase className="h-4 w-4" />;
    case "education":
      return <GraduationCap className="h-4 w-4" />;
    case "projects":
    case "project":
      return <Code className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

const getPlaceholder = (type, field) => {
  const lowerType = type?.toLowerCase();
  switch (field) {
    case "title":
      if (lowerType === "education") return "e.g., Bachelor of Science in Computer Science";
      if (lowerType === "projects" || lowerType === "project") return "e.g., E-commerce Web Application";
      return "e.g., Senior Software Engineer";
    case "organization":
      if (lowerType === "education") return "e.g., University of California, Berkeley";
      if (lowerType === "projects" || lowerType === "project") return "e.g., Personal Project / Company Name";
      return "e.g., Tech Solutions Inc.";
    case "description":
      if (lowerType === "education") return "Describe your academic achievements, relevant coursework, thesis work, and key learnings...";
      if (lowerType === "projects" || lowerType === "project") return "Describe the project goals, your role, technologies used, challenges overcome, and outcomes achieved...";
      return "Describe your key responsibilities, achievements, and impact in this role. Use action verbs and quantify results where possible...";
    default:
      return "";
  }
};

export function EntryForm({ type, entries = [], onChange }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  // Handle dialog operations
  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      const entry = entries[index];
      reset({
        ...entry,
        startDate: entry.startDate ? parse(entry.startDate, "MMM yyyy", new Date()).toISOString().slice(0, 7) : "",
        endDate: entry.endDate ? parse(entry.endDate, "MMM yyyy", new Date()).toISOString().slice(0, 7) : "",
      });
      setSkills(entry.skills || []);
    } else {
      setEditingIndex(null);
      reset({
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      });
      setSkills([]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    setSkills([]);
    setNewSkill("");
    reset();
  };

  const handleSaveEntry = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
      skills: skills.length > 0 ? skills : undefined,
    };

    const updatedEntries = [...entries];
    if (editingIndex !== null) {
      updatedEntries[editingIndex] = formattedEntry;
      toast.success(`${type} updated successfully!`);
    } else {
      updatedEntries.push(formattedEntry);
      toast.success(`${type} added successfully!`);
    }

    onChange(updatedEntries);
    handleCloseDialog();
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
    toast.success(`${type} deleted successfully!`);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
      context: {
        title: watch("title"),
        organization: watch("organization"),
        skills: skills,
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {getEntryIcon(type)}
          {type}
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add {type.slice(0, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit" : "Add"} {type.slice(0, -1)}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSaveEntry} className="space-y-6">
              {/* Title Field */}
              <div>
                <Label htmlFor="title">
                  {type.toLowerCase() === "education" ? "Degree" : 
                   type.toLowerCase() === "projects" ? "Project Name" : "Job Title"} *
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder={getPlaceholder(type, "title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Organization Field */}
              <div>
                <Label htmlFor="organization">
                  {type.toLowerCase() === "education" ? "Institution" : 
                   type.toLowerCase() === "projects" ? "Organization/Client" : "Company"} *
                </Label>
                <Input
                  id="organization"
                  {...register("organization")}
                  placeholder={getPlaceholder(type, "organization")}
                />
                {errors.organization && (
                  <p className="text-sm text-destructive mt-1">{errors.organization.message}</p>
                )}
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="month"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    {...register("endDate")}
                    disabled={current}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="current"
                    {...register("current")}
                    onChange={(e) => {
                      setValue("current", e.target.checked);
                      if (e.target.checked) {
                        setValue("endDate", "");
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor="current" className="text-sm">
                    Currently {type.toLowerCase() === "education" ? "studying" : 
                               type.toLowerCase() === "projects" ? "working on" : "working"} here
                  </Label>
                </div>
              </div>

              {/* Skills/Technologies (for Experience and Projects) */}
              {(type.toLowerCase() === "experience" || type.toLowerCase() === "projects") && (
                <div>
                  <Label>Skills/Technologies</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g., React, Node.js, Python"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Description Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Description *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImproveDescription}
                    disabled={isImproving || !watch("description")?.trim()}
                    className="flex items-center gap-2"
                  >
                    {isImproving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Improve with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="h-32"
                  placeholder={getPlaceholder(type, "description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingIndex !== null ? "Update" : "Add"} {type.slice(0, -1)}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <div className="mb-2 flex justify-center">
                  {getEntryIcon(type)}
                </div>
                <p className="text-sm">
                  No {type.toLowerCase()} added yet. Click "Add {type.slice(0, -1)}" to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          entries.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{item.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {item.startDate} - {item.current ? "Present" : item.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                  {item.description}
                </p>
                
                {/* Skills/Technologies */}
                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
