"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Download,
  Loader2,
  Save,
  BarChart3,
  FileText,
  Eye,
  ArrowLeft,
  ArrowRight,
  X,
  FileDown,
  File,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  PlusCircle,
  Plus,
  Trash2,
  Edit,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveResume, improveWithAI } from "@/actions/resume-fast";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import { AISuggestions } from "./ai-suggestions";
import { EnhancedATSOptimizer } from "./enhanced-ats-optimizer-v2";

// Local Entry Form Component to avoid prop mismatch and maintain self-contained state
function LocalEntryForm({
  type,
  fieldName,
  formValues,
  setValue,
  title,
  fields,
  improveWithAIFn,
  isImproving,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const entries = formValues?.[fieldName] || [];

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue: setLocalValue,
  } = useForm();

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      const entry = entries[index];
      reset({ ...entry });
    } else {
      setEditingIndex(null);
      const initialFormValues = {};
      fields.forEach((field) => {
        initialFormValues[field.name] = "";
      });
      reset(initialFormValues);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    reset();
  };

  const handleSaveEntry = handleValidation((data) => {
    const updatedEntries = [...entries];
    if (editingIndex !== null) {
      updatedEntries[editingIndex] = data;
      toast.success(`${title} entry updated!`);
    } else {
      updatedEntries.push(data);
      toast.success(`${title} entry added!`);
    }

    setValue(fieldName, updatedEntries);
    handleCloseDialog();
  });

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setValue(fieldName, updatedEntries);
    toast.success(`${title} entry deleted!`);
  };

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    const titleVal = watch("title") || watch("position") || watch("degree") || "";
    const orgVal = watch("organization") || watch("company") || watch("institution") || "";

    try {
      const result = await improveWithAIFn({
        current: description,
        type: type?.toLowerCase() || "experience",
        context: {
          title: titleVal,
          organization: orgVal,
          skills: watch("technologies") ? watch("technologies").split(",") : [],
        }
      });
      if (result?.improved) {
        setLocalValue("description", result.improved);
        toast.success("Description improved successfully!");
      }
    } catch (err) {
      toast.error("Failed to improve description");
    }
  };

  const getEntryDisplayData = (item) => {
    const mainTitle = item.company || item.institution || item.title || "Untitled Entry";
    const subTitle = item.position || item.degree || item.technologies || "";
    const extraInfo = item.field || item.location || "";
    return {
      mainTitle,
      subTitle: extraInfo ? `${subTitle} (${extraInfo})` : subTitle,
      duration: item.duration || "",
      description: item.description || "",
      link: item.link || "",
    };
  };

  const getEntryIcon = (sectionType) => {
    switch (sectionType) {
      case "experience":
        return <Briefcase className="h-4 w-4" />;
      case "education":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
          {getEntryIcon(type)}
          {title}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 border-border text-foreground hover:bg-muted"
        >
          <PlusCircle className="h-4 w-4" />
          Add {title?.slice(0, -1) || "Entry"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingIndex !== null ? "Edit" : "Add"} {title?.slice(0, -1) || "Entry"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveEntry} className="space-y-6">
            {fields.map((field) => {
              const isTextArea = field.type === "textarea";
              
              if (field.name === "description") {
                return (
                  <div key={field.name} className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description" className="text-foreground">Description {field.required && "*"}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleImproveDescription}
                        disabled={isImproving || !watch("description")?.trim()}
                        className="flex items-center gap-2 border-border text-foreground"
                      >
                        {isImproving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Improving...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-primary" />
                            Improve with AI
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      {...register("description", { required: field.required ? "Description is required" : false })}
                      className="h-32 bg-background border-border text-foreground resize-none"
                      placeholder={field.placeholder}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-foreground">
                    {field.placeholder.replace(" *", "")} {field.required && "*"}
                  </Label>
                  <Input
                    id={field.name}
                    type="text"
                    {...register(field.name, { required: field.required ? `${field.placeholder.replace(" *", "")} is required` : false })}
                    placeholder={field.placeholder}
                    className="bg-background border-border text-foreground"
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-destructive mt-1">{errors[field.name].message}</p>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isDirty && editingIndex !== null}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="h-4 w-4" />
                {editingIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  No entries added yet. Click "Add {title?.slice(0, -1) || "Entry"}" to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          entries.map((item, index) => {
            const display = getEntryDisplayData(item);
            return (
              <Card key={index} className="border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base text-foreground font-semibold">{display.mainTitle}</CardTitle>
                      {display.subTitle && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{display.subTitle}</span>
                        </div>
                      )}
                      {display.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{display.duration}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(index)}
                        className="text-foreground hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {display.link && (
                    <div className="text-xs text-primary flex items-center gap-1 mb-2">
                      <ExternalLink className="h-3 w-3" />
                      <a href={display.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {display.link}
                      </a>
                    </div>
                  )}
                  {display.description && (
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap leading-relaxed">
                      {display.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderResumeHTML = (formValues, user, density = 'standard', fontFamily = 'serif') => {
  const name = escapeHTML(user?.fullName || 'Your Name');
  const email = escapeHTML(formValues.contactInfo?.email || '');
  const mobile = escapeHTML(formValues.contactInfo?.mobile || '');
  
  const linkedin = formValues.contactInfo?.linkedin
    ? escapeHTML(formValues.contactInfo.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, ''))
    : '';
    
  const twitter = formValues.contactInfo?.twitter
    ? escapeHTML(formValues.contactInfo.twitter.replace(/https?:\/\/(www\.)?twitter\.com\//, '').replace(/\/$/, ''))
    : '';

  const contactParts = [];
  if (email) contactParts.push(email);
  if (mobile) contactParts.push(mobile);
  if (linkedin) contactParts.push(`linkedin.com/in/${linkedin}`);
  if (twitter) contactParts.push(`twitter.com/${twitter}`);
  const contactLine = contactParts.join('  •  ');

  // Font family settings
  let fontCSS = "'Times New Roman', Times, serif";
  if (fontFamily === 'sans') {
    fontCSS = "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  } else if (fontFamily === 'mono') {
    fontCSS = "Menlo, Monaco, Consolas, 'Fira Code', monospace";
  }

  // Density settings
  let pagePadding = '35px 45px';
  let sectionMargin = '12px';
  let itemMargin = '5px';
  let lineHeight = '1.35';
  let fontSizeName = '26px';
  let fontSizeContact = '11px';
  let fontSizeSectionHeading = '13.5px';
  let fontSizeItemHeading = '11.5px';
  let fontSizeSubHeading = '11px';
  let fontSizeBody = '11px';
  let bulletMargin = '2px';

  if (density === 'compact') {
    pagePadding = '22px 35px 22px 35px';
    sectionMargin = '8px';
    itemMargin = '3px';
    lineHeight = '1.2';
    fontSizeName = '24px';
    fontSizeContact = '10.5px';
    fontSizeSectionHeading = '12.5px';
    fontSizeItemHeading = '11px';
    fontSizeSubHeading = '10.5px';
    fontSizeBody = '10.5px';
    bulletMargin = '1.5px';
  } else if (density === 'spacious') {
    pagePadding = '45px 55px 45px 55px';
    sectionMargin = '16px';
    itemMargin = '8px';
    lineHeight = '1.5';
    fontSizeName = '28px';
    fontSizeContact = '12px';
    fontSizeSectionHeading = '14.5px';
    fontSizeItemHeading = '12.5px';
    fontSizeSubHeading = '11.5px';
    fontSizeBody = '11.5px';
    bulletMargin = '4px';
  }

  // Professional Summary
  let summaryHTML = '';
  if (formValues.summary) {
    summaryHTML = `
      <div style="margin-bottom: ${sectionMargin}; page-break-inside: avoid;">
        <h2 style="font-size: ${fontSizeSectionHeading}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0 0 1px 0; color: #0f172a; letter-spacing: 1px;">Professional Summary</h2>
        <div style="border-top: 1px solid #475569; margin-top: 2px; margin-bottom: 5px; height: 0; overflow: hidden; clear: both;"></div>
        <p style="margin: 0; text-align: justify; font-size: ${fontSizeBody}; line-height: ${lineHeight}; color: #334155;">${escapeHTML(formValues.summary)}</p>
      </div>
    `;
  }

  // Education
  let educationHTML = '';
  if (formValues.education && formValues.education.length > 0) {
    const eduItems = formValues.education.map(edu => {
      const descriptionHTML = edu.description 
        ? `<p style="margin: 3px 0 0 0; font-size: ${fontSizeBody}; line-height: ${lineHeight}; color: #334155; text-align: justify;">${escapeHTML(edu.description)}</p>` 
        : '';
      return `
        <div style="margin-top: ${itemMargin}; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
            <tr>
              <td style="text-align: left; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">${escapeHTML(edu.institution)}</td>
              <td style="text-align: right; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">${escapeHTML(edu.duration || '')}</td>
            </tr>
            <tr>
              <td style="text-align: left; font-style: italic; font-size: ${fontSizeSubHeading}; padding: 1px 0 0 0; color: #475569;">${escapeHTML(edu.degree)}${edu.field ? ` in ${escapeHTML(edu.field)}` : ''}</td>
              <td style="text-align: right; font-style: italic; font-size: ${fontSizeSubHeading}; padding: 1px 0 0 0; color: #475569;"></td>
            </tr>
          </table>
          ${descriptionHTML}
        </div>
      `;
    }).join('');

    educationHTML = `
      <div style="margin-bottom: ${sectionMargin}; page-break-inside: avoid;">
        <h2 style="font-size: ${fontSizeSectionHeading}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0 0 1px 0; color: #0f172a; letter-spacing: 1px;">Education</h2>
        <div style="border-top: 1px solid #475569; margin-top: 2px; margin-bottom: 5px; height: 0; overflow: hidden; clear: both;"></div>
        ${eduItems}
      </div>
    `;
  }

  // Work Experience
  let experienceHTML = '';
  if (formValues.experience && formValues.experience.length > 0) {
    const expItems = formValues.experience.map(exp => {
      let bulletsHTML = '';
      if (exp.description) {
        bulletsHTML = `
          <ul style="margin: ${bulletMargin} 0 0 0; padding-left: 15px; list-style-type: disc; text-align: justify;">
            ${exp.description.split(/\r?\n/).map(bullet => {
              const cleaned = bullet.trim().replace(/^[•\-\*\s]+/, '');
              if (!cleaned) return '';
              return `<li style="margin-bottom: ${bulletMargin}; font-size: ${fontSizeBody}; line-height: ${lineHeight}; color: #334155; padding-left: 2px;">${escapeHTML(cleaned)}</li>`;
            }).join('')}
          </ul>
        `;
      }

      return `
        <div style="margin-top: ${itemMargin}; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
            <tr>
              <td style="text-align: left; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">${escapeHTML(exp.company)}</td>
              <td style="text-align: right; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">${escapeHTML(exp.duration || '')}</td>
            </tr>
            <tr>
              <td style="text-align: left; font-style: italic; font-size: ${fontSizeSubHeading}; padding: 1px 0 0 0; color: #475569;">${escapeHTML(exp.position)}</td>
              <td style="text-align: right; font-style: italic; font-size: ${fontSizeSubHeading}; padding: 1px 0 0 0; color: #475569;">${escapeHTML(exp.location || '')}</td>
            </tr>
          </table>
          ${bulletsHTML}
        </div>
      `;
    }).join('');

    experienceHTML = `
      <div style="margin-bottom: ${sectionMargin}; page-break-inside: avoid;">
        <h2 style="font-size: ${fontSizeSectionHeading}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0 0 1px 0; color: #0f172a; letter-spacing: 1px;">Work Experience</h2>
        <div style="border-top: 1px solid #475569; margin-top: 2px; margin-bottom: 5px; height: 0; overflow: hidden; clear: both;"></div>
        ${expItems}
      </div>
    `;
  }

  // Projects
  let projectsHTML = '';
  if (formValues.projects && formValues.projects.length > 0) {
    const projItems = formValues.projects.map(proj => {
      let bulletsHTML = '';
      if (proj.description) {
        bulletsHTML = `
          <ul style="margin: ${bulletMargin} 0 0 0; padding-left: 15px; list-style-type: disc; text-align: justify;">
            ${proj.description.split(/\r?\n/).map(bullet => {
              const cleaned = bullet.trim().replace(/^[•\-\*\s]+/, '');
              if (!cleaned) return '';
              return `<li style="margin-bottom: ${bulletMargin}; font-size: ${fontSizeBody}; line-height: ${lineHeight}; color: #334155; padding-left: 2px;">${escapeHTML(cleaned)}</li>`;
            }).join('')}
          </ul>
        `;
      }

      return `
        <div style="margin-top: ${itemMargin}; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
            <tr>
              <td style="text-align: left; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">
                ${escapeHTML(proj.title)} ${proj.technologies ? `<span style="font-weight: normal; font-style: italic; font-size: ${fontSizeSubHeading}; color: #475569;">| ${escapeHTML(proj.technologies)}</span>` : ''}
              </td>
              <td style="text-align: right; font-weight: bold; font-size: ${fontSizeItemHeading}; padding: 0; color: #0f172a;">${escapeHTML(proj.duration || '')}</td>
            </tr>
          </table>
          ${proj.link ? `<div style="font-size: 10px; color: #2563eb; margin: 2px 0; word-break: break-all;">${escapeHTML(proj.link)}</div>` : ''}
          ${bulletsHTML}
        </div>
      `;
    }).join('');

    projectsHTML = `
      <div style="margin-bottom: ${sectionMargin}; page-break-inside: avoid;">
        <h2 style="font-size: ${fontSizeSectionHeading}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0 0 1px 0; color: #0f172a; letter-spacing: 1px;">Projects</h2>
        <div style="border-top: 1px solid #475569; margin-top: 2px; margin-bottom: 5px; height: 0; overflow: hidden; clear: both;"></div>
        ${projItems}
      </div>
    `;
  }

  // Skills
  let skillsHTML = '';
  if (formValues.skills) {
    const skillRows = formValues.skills.split(/\r?\n/).map(skillRow => {
      if (!skillRow.trim()) return '';
      const parts = skillRow.split(':');
      if (parts.length > 1) {
        return `<p style="margin: 2px 0; font-size: ${fontSizeBody}; color: #334155; line-height: ${lineHeight};"><strong>${escapeHTML(parts[0].trim())}:</strong> ${escapeHTML(parts.slice(1).join(':').trim())}</p>`;
      }
      return `<p style="margin: 2px 0; font-size: ${fontSizeBody}; color: #334155; line-height: ${lineHeight};">${escapeHTML(skillRow.trim())}</p>`;
    }).join('');

    skillsHTML = `
      <div style="margin-bottom: ${sectionMargin}; page-break-inside: avoid;">
        <h2 style="font-size: ${fontSizeSectionHeading}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0 0 1px 0; color: #0f172a; letter-spacing: 1px;">Technical Skills</h2>
        <div style="border-top: 1px solid #475569; margin-top: 2px; margin-bottom: 5px; height: 0; overflow: hidden; clear: both;"></div>
        <div style="margin-top: 3px;">
          ${skillRows}
        </div>
      </div>
    `;
  }

  return `
    <div style="padding: ${pagePadding}; font-family: ${fontCSS}; color: #0f172a; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; line-height: ${lineHeight}; background-color: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 12px;">
        <h1 style="font-size: ${fontSizeName}; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px; color: #000;">${name}</h1>
        <div style="font-size: ${fontSizeContact}; color: #475569; letter-spacing: 0.2px;">
          ${contactLine}
        </div>
      </div>

      ${summaryHTML}
      ${educationHTML}
      ${experienceHTML}
      ${projectsHTML}
      ${skillsHTML}
    </div>
  `;
};

export default function ProfessionalResumeBuilder({ initialContent }) {
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [currentSection, setCurrentSection] = useState("contact");
  const [isMobile, setIsMobile] = useState(false);
  
  const [scale, setScale] = useState(1);
  const [density, setDensity] = useState("standard");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [fontFamily, setFontFamily] = useState("serif");
  
  const previewWrapperRef = useRef(null);
  const previewContentRef = useRef(null);

  useEffect(() => {
    if (!previewWrapperRef.current) return;
    // Set initial scale immediately
    const el = previewWrapperRef.current;
    const computeScale = (width) => Math.min(1, Math.max(0.2, width / 800));
    setScale(computeScale(el.offsetWidth));

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setScale(computeScale(entry.contentRect.width));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  
  const [jobContext, setJobContext] = useState({
    targetRole: "",
    companyName: "",
    jobDescription: "",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (!previewContentRef.current) return;
    const checkOverflow = () => {
      if (previewContentRef.current) {
        setIsOverflowing(previewContentRef.current.scrollHeight > 1130);
      }
    };
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(previewContentRef.current);
    return () => observer.disconnect();
  }, [formValues, density, fontFamily]);

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isImproving,
    fn: improveWithAIFn,
  } = useFetch(improveWithAI);

  // Define form submission handler
  const onSubmit = useCallback(async (data, isAutoSave = false) => {
    try {
      await saveResumeFn({
        userId: user?.id,
        content: data,
      });
      if (!isAutoSave) {
        toast.success("Resume saved successfully!");
      }
    } catch (error) {
      if (!isAutoSave) {
        toast.error("Failed to save resume");
      }
      throw error;
    }
  }, [saveResumeFn, user?.id]);

  // Error handling
  useEffect(() => {
    if (saveError) {
      toast.error("Failed to save resume. Please try again.");
    }
  }, [saveError]);

  // Enhanced mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && showATSPanel) {
        setShowATSPanel(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [showATSPanel]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (formValues && Object.keys(formValues).length > 0 && !isSaving) {
        const hasContent = formValues.contactInfo?.email || 
                          formValues.summary || 
                          formValues.skills || 
                          formValues.experience?.length > 0;
        
        if (hasContent) {
          handleSubmit((data) => onSubmit(data, true))().catch(() => {
            // Silent auto-save failure
          });
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [formValues, isSaving, handleSubmit, onSubmit]);

  // Load initial content
  useEffect(() => {
    if (initialContent && typeof initialContent === 'object') {
      reset(initialContent);
      setPreviewContent(entriesToMarkdown(initialContent));
    }
  }, [initialContent, reset]);

  // Update preview content when form values change with debouncing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (formValues) {
        setPreviewContent(entriesToMarkdown(formValues));
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [formValues]);

  // Section configuration
  const sections = [
    { id: "contact", label: "Contact", icon: User, shortLabel: "Contact" },
    { id: "summary", label: "Summary", icon: FileText, shortLabel: "Summary" },
    { id: "experience", label: "Experience", icon: Briefcase, shortLabel: "Work" },
    { id: "education", label: "Education", icon: GraduationCap, shortLabel: "Education" },
    { id: "skills", label: "Skills", icon: Award, shortLabel: "Skills" },
    { id: "projects", label: "Projects", icon: Code, shortLabel: "Projects" },
  ];

  const currentSectionIndex = sections.findIndex(s => s.id === currentSection);

  const goToPrevSection = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSection(sections[currentSectionIndex - 1].id);
    }
  }, [currentSectionIndex, sections]);

  const goToNextSection = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSection(sections[currentSectionIndex + 1].id);
    }
  }, [currentSectionIndex, sections]);

  // Keyboard navigation Alt+Arrow, Cmd+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'ArrowRight' && currentSectionIndex < sections.length - 1) {
        e.preventDefault();
        goToNextSection();
      }
      if (e.altKey && e.key === 'ArrowLeft' && currentSectionIndex > 0) {
        e.preventDefault();
        goToPrevSection();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit((data) => onSubmit(data, false))();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, sections.length, goToNextSection, goToPrevSection, onSubmit, handleSubmit]);

  const downloadAsPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '800px';
      tempDiv.style.height = '1130px';
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.background = 'white';
      tempDiv.style.boxSizing = 'border-box';
      
      tempDiv.innerHTML = renderResumeHTML(formValues, user, density, fontFamily);
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      document.body.removeChild(tempDiv);
      
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imgData = reader.result;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);
            pdf.save('resume.pdf');
            toast.success('Resume downloaded as PDF!');
            resolve();
          };
          reader.readAsDataURL(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const downloadAsWord = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Resume</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; margin: 40px; font-size: 10.5pt; color: #111; line-height: 1.25; }
              h1 { text-align: center; font-size: 18pt; margin: 0 0 4pt 0; text-transform: uppercase; font-weight: bold; }
              .contact { text-align: center; margin-bottom: 12pt; font-size: 9.5pt; color: #333; }
              h2 { font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 12pt 0 4pt 0; border-bottom: 1pt solid #111; padding-bottom: 1pt; }
              .entry-table { width: 100%; border-collapse: collapse; margin-top: 4pt; }
              .entry-table td { padding: 0; }
              .bullet-list { margin: 2pt 0; padding-left: 12pt; }
              .bullet-item { display: list-item; list-style-type: disc; margin-bottom: 2pt; text-align: justify; font-size: 9.5pt; }
              .skills-section { margin-top: 3pt; font-size: 10pt; }
              .skills-section p { margin: 2pt 0; }
            </style>
          </head>
          <body>
            <h1>${user?.fullName || 'Your Name'}</h1>
            <div class="contact">
              ${formValues.contactInfo?.email ? `${formValues.contactInfo.email}` : ''}
              ${formValues.contactInfo?.mobile ? ` | ${formValues.contactInfo.mobile}` : ''}
              ${formValues.contactInfo?.linkedin ? ` | linkedin.com/in/${formValues.contactInfo.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}` : ''}
              ${formValues.contactInfo?.twitter ? ` | twitter.com/${formValues.contactInfo.twitter.replace(/https?:\/\/(www\.)?twitter\.com\//, '').replace(/\/$/, '')}` : ''}
            </div>

            <!-- Summary -->
            ${formValues.summary ? `
            <div>
              <h2>Professional Summary</h2>
              <p style="margin: 3pt 0 0 0; text-align: justify; font-size: 10pt;">${formValues.summary}</p>
            </div>
            ` : ''}

            <!-- Education -->
            ${formValues.education?.length ? `
            <div>
              <h2>Education</h2>
              ${formValues.education.map(edu => `
                <div style="margin-top: 4pt;">
                  <table class="entry-table">
                    <tr>
                      <td style="text-align: left; font-weight: bold;">${edu.institution}</td>
                      <td style="text-align: right; font-weight: bold;">${edu.duration || ''}</td>
                    </tr>
                    <tr>
                      <td style="text-align: left; font-style: italic; font-size: 9.5pt;">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</td>
                      <td style="text-align: right; font-style: italic; font-size: 9.5pt;"></td>
                    </tr>
                  </table>
                  ${edu.description ? `<p style="margin: 2pt 0 0 0; font-size: 9.5pt; color: #444;">${edu.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Experience -->
            ${formValues.experience?.length ? `
            <div>
              <h2>Work Experience</h2>
              ${formValues.experience.map(exp => `
                <div style="margin-top: 4pt;">
                  <table class="entry-table">
                    <tr>
                      <td style="text-align: left; font-weight: bold;">${exp.company}</td>
                      <td style="text-align: right; font-weight: bold;">${exp.duration || ''}</td>
                    </tr>
                    <tr>
                      <td style="text-align: left; font-style: italic; font-size: 9.5pt;">${exp.position}</td>
                      <td style="text-align: right; font-style: italic; font-size: 9.5pt;">${exp.location || ''}</td>
                    </tr>
                  </table>
                  <div class="bullet-list">
                    ${exp.description ? exp.description.split('\n').map(bullet => bullet.trim() ? `<div class="bullet-item">${bullet.replace(/^[•\-\*\s]+/, '')}</div>` : '').join('') : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Projects -->
            ${formValues.projects?.length ? `
            <div>
              <h2>Projects</h2>
              ${formValues.projects.map(proj => `
                <div style="margin-top: 4pt;">
                  <table class="entry-table">
                    <tr>
                      <td style="text-align: left; font-weight: bold;">
                        ${proj.title} ${proj.technologies ? `<span style="font-weight: normal; font-style: italic; font-size: 9.5pt; color: #444;">| ${proj.technologies}</span>` : ''}
                      </td>
                      <td style="text-align: right; font-weight: bold;">${proj.duration || ''}</td>
                    </tr>
                  </table>
                  ${proj.link ? `<div style="font-size: 9pt; color: #2563eb; margin: 1pt 0;">${proj.link}</div>` : ''}
                  <div class="bullet-list">
                    ${proj.description ? proj.description.split('\n').map(bullet => bullet.trim() ? `<div class="bullet-item">${bullet.replace(/^[•\-\*\s]+/, '')}</div>` : '').join('') : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Skills -->
            ${formValues.skills ? `
            <div>
              <h2>Technical Skills</h2>
              <div class="skills-section">
                ${formValues.skills.split('\n').map(skillRow => {
                  if (!skillRow.trim()) return '';
                  const parts = skillRow.split(':');
                  if (parts.length > 1) {
                    return `<p><strong>${parts[0].trim()}:</strong> ${parts.slice(1).join(':').trim()}</p>`;
                  }
                  return `<p>${skillRow.trim()}</p>`;
                }).join('')}
              </div>
            </div>
            ` : ''}
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded as Word document!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document. Please try again.');
    }
  };

  const handleOptimizedResume = (optimizedContent) => {
    try {
      setValue("summary", optimizedContent);
      toast.success("Optimized resume content applied!");
    } catch (error) {
      console.error("Error applying optimized resume:", error);
      toast.error("Failed to apply optimized content");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">Resume Builder</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Professional
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                variant={showATSPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowATSPanel(!showATSPanel)}
                className="hidden sm:flex items-center gap-2 border-border text-foreground hover:bg-muted"
              >
                <BarChart3 className="h-4 w-4" />
                ATS Score
              </Button>
              
              <Button
                variant={showATSPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowATSPanel(!showATSPanel)}
                className="sm:hidden border-border text-foreground hover:bg-muted"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Download</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  <DropdownMenuItem onClick={downloadAsPDF} className="hover:bg-muted cursor-pointer">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadAsWord} className="hover:bg-muted cursor-pointer">
                    <File className="h-4 w-4 mr-2" />
                    Download as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                onClick={() => handleSubmit((data) => onSubmit(data, false))()}
                disabled={isSaving}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ATS Score Panel */}
        {showATSPanel && (
          <div className="mb-4 sm:mb-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    ATS Optimization
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowATSPanel(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <EnhancedATSOptimizer
                  resumeContent={previewContent}
                  jobDescription={jobContext.jobDescription}
                  targetRole={jobContext.targetRole}
                  companyName={jobContext.companyName}
                  onOptimizedResume={handleOptimizedResume}
                  userName={user?.fullName}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Form Side */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 border-b border-border">
                <CardTitle className="text-base sm:text-lg text-foreground">Build Your Resume</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Mobile Section Nav */}
                {isMobile && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevSection}
                        disabled={currentSectionIndex === 0}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 mx-4">
                        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
                          {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                              <Button
                                key={section.id}
                                variant={currentSection === section.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentSection(section.id)}
                                className="flex-shrink-0"
                              >
                                <Icon className="h-4 w-4 mr-1" />
                                <span>{section.shortLabel}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <Progress 
                          value={((currentSectionIndex + 1) / sections.length) * 100} 
                          className="mt-2 h-1 bg-border"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextSection}
                        disabled={currentSectionIndex === sections.length - 1}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Desktop Tabs */}
                {!isMobile && (
                  <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-6 border border-border bg-muted p-1">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-1">
                            <Icon className="h-4 w-4" />
                            <span className="hidden md:inline">{section.label}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                )}

                {/* Form Contents */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  {currentSection === "contact" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("contactInfo.email")}
                            placeholder="e.g., alex@domain.com"
                            className="bg-background border-border text-foreground"
                          />
                          {errors.contactInfo?.email && (
                            <p className="text-sm text-destructive mt-1">{errors.contactInfo.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-foreground">Phone Number *</Label>
                          <Input
                            id="mobile"
                            type="tel"
                            {...register("contactInfo.mobile")}
                            placeholder="e.g., +1 555 123 4567"
                            className="bg-background border-border text-foreground"
                          />
                          {errors.contactInfo?.mobile && (
                            <p className="text-sm text-destructive mt-1">{errors.contactInfo.mobile.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="text-foreground">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            type="text"
                            {...register("contactInfo.linkedin")}
                            placeholder="e.g., linkedin.com/in/alex"
                            className="bg-background border-border text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="text-foreground">Twitter/X URL</Label>
                          <Input
                            id="twitter"
                            type="text"
                            {...register("contactInfo.twitter")}
                            placeholder="e.g., twitter.com/alex"
                            className="bg-background border-border text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Summary */}
                  {currentSection === "summary" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="summary" className="text-foreground">Professional Summary *</Label>
                        <Textarea
                          id="summary"
                          {...register("summary")}
                          placeholder="Write a brief professional summary that outlines your key career accomplishments..."
                          className="min-h-[140px] bg-background border-border text-foreground resize-none"
                          rows={6}
                        />
                        {errors.summary && (
                          <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>
                        )}
                      </div>
                      <AISuggestions
                        section="Summary"
                        currentContent={formValues.summary}
                        onApplySuggestion={(content) => setValue("summary", content)}
                      />
                    </div>
                  )}

                  {/* Skills */}
                  {currentSection === "skills" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-foreground">Technical Skills *</Label>
                        <Textarea
                          id="skills"
                          {...register("skills")}
                          placeholder="Format your skills. e.g.:&#10;Programming Languages: JavaScript, Python, C++&#10;Frameworks: React, Next.js, Node.js&#10;Tools: Git, Docker, AWS"
                          className="min-h-[140px] bg-background border-border text-foreground resize-none"
                          rows={6}
                        />
                        {errors.skills && (
                          <p className="text-sm text-destructive mt-1">{errors.skills.message}</p>
                        )}
                      </div>
                      <AISuggestions
                        section="Skills"
                        currentContent={formValues.skills}
                        onApplySuggestion={(content) => setValue("skills", content)}
                      />
                    </div>
                  )}

                  {/* Work Experience */}
                  {currentSection === "experience" && (
                    <LocalEntryForm
                      type="experience"
                      fieldName="experience"
                      formValues={formValues}
                      setValue={setValue}
                      title="Work Experience"
                      improveWithAIFn={improveWithAIFn}
                      isImproving={isImproving}
                      fields={[
                        { name: "company", placeholder: "Company Name *", required: true },
                        { name: "position", placeholder: "Job Title *", required: true },
                        { name: "location", placeholder: "Location (e.g. San Francisco, CA)" },
                        { name: "duration", placeholder: "Duration (e.g. Jan 2020 - Present)", required: true },
                        { name: "description", placeholder: "Describe key responsibilities and accomplishments...", type: "textarea", required: true },
                      ]}
                    />
                  )}

                  {/* Education */}
                  {currentSection === "education" && (
                    <LocalEntryForm
                      type="education"
                      fieldName="education"
                      formValues={formValues}
                      setValue={setValue}
                      title="Education"
                      improveWithAIFn={improveWithAIFn}
                      isImproving={isImproving}
                      fields={[
                        { name: "institution", placeholder: "Institution *", required: true },
                        { name: "degree", placeholder: "Degree/Certificate *", required: true },
                        { name: "field", placeholder: "Field of Study (e.g. Computer Science)" },
                        { name: "duration", placeholder: "Duration (e.g. 2018 - 2022)", required: true },
                        { name: "description", placeholder: "coursework, achievements, honors...", type: "textarea" },
                      ]}
                    />
                  )}

                  {/* Projects */}
                  {currentSection === "projects" && (
                    <LocalEntryForm
                      type="projects"
                      fieldName="projects"
                      formValues={formValues}
                      setValue={setValue}
                      title="Projects"
                      improveWithAIFn={improveWithAIFn}
                      isImproving={isImproving}
                      fields={[
                        { name: "title", placeholder: "Project Title *", required: true },
                        { name: "technologies", placeholder: "Technologies (e.g. React, Rails, PostgreSQL)" },
                        { name: "link", placeholder: "Project URL/GitHub Link" },
                        { name: "duration", placeholder: "Duration (e.g. 3 Months)" },
                        { name: "description", placeholder: "Describe your project contribution and goals...", type: "textarea", required: true },
                      ]}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <Card className="bg-card border-border shadow-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Live Preview
                    </CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider px-2">
                      ● Live
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Font Selector */}
                    <div className="flex items-center bg-muted border border-border rounded-md p-0.5 text-[11px] flex-shrink-0">
                      {['serif', 'sans', 'mono'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFontFamily(f)}
                          className={`px-2.5 py-1 rounded capitalize transition-colors ${fontFamily === f ? 'bg-background text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    {/* Density Selector */}
                    <div className="flex items-center bg-muted border border-border rounded-md p-0.5 text-[11px] flex-shrink-0">
                      {['compact', 'standard', 'spacious'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDensity(d)}
                          className={`px-2.5 py-1 rounded capitalize transition-colors ${density === d ? 'bg-background text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {/* Outer wrapper: measured by ResizeObserver to compute scale */}
                <div
                  ref={previewWrapperRef}
                  className="w-full bg-white rounded-lg border border-zinc-200 overflow-hidden relative shadow-sm"
                  style={{ height: `${Math.round(1130 * scale)}px`, minHeight: '200px' }}
                >
                  {/* Inner resume at actual A4 size, scaled down to fit wrapper */}
                  <div
                    ref={previewContentRef}
                    style={{
                      width: '800px',
                      height: '1130px',
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    className="bg-white text-zinc-950 select-none"
                    dangerouslySetInnerHTML={{ __html: renderResumeHTML(formValues, user, density, fontFamily) }}
                  />
                </div>

                {isOverflowing && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Page overflow:</span> Content exceeds one page.{" "}
                      <button
                        type="button"
                        onClick={() => setDensity('compact')}
                        className="font-semibold underline hover:no-underline"
                      >
                        Switch to Compact
                      </button>{" "}
                      or shorten bullet points to keep it to one page.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
