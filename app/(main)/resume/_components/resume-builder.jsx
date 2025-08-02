"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Sparkles,
  Wand2,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume, improveWithAI, improveEntireResume, generateSuggestions, generateResumeSection } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import { AISuggestions } from "./ai-suggestions";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { ATSOptimizer } from "./ats-optimizer";
import { QuickATSScore } from "./quick-ats-score";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  
  // ATS Context
  const [atsContext, setAtsContext] = useState({
    jobDescription: "",
    targetRole: "",
    companyName: "",
    enabled: false
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improveResult,
    error: improveError,
  } = useFetch(improveWithAI);

  const {
    loading: isImprovingEntire,
    fn: improveEntireResumeFn,
    data: improvedResumeResult,
    error: improveEntireError,
  } = useFetch(improveEntireResume);

  const {
    loading: isGeneratingSuggestions,
    fn: generateSuggestionsFn,
    data: suggestionsResult,
    error: suggestionsError,
  } = useFetch(generateSuggestions);

  const {
    loading: isGeneratingSection,
    fn: generateResumeSectionFn,
    data: generatedSectionResult,
    error: generateSectionError,
  } = useFetch(generateResumeSection);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  // Handle AI operation results and errors
  useEffect(() => {
    if (improveError) {
      toast.error("Failed to improve content. Please try again.");
    }
  }, [improveError]);

  useEffect(() => {
    if (improveEntireError) {
      toast.error("Failed to improve entire resume. Please try again.");
    }
  }, [improveEntireError]);

  useEffect(() => {
    if (generateSectionError) {
      toast.error("Failed to generate content. Please try again.");
    }
  }, [generateSectionError]);

  // Handle AI operation results and errors
  useEffect(() => {
    if (improveError) {
      toast.error("Failed to improve content. Please try again.");
    }
  }, [improveError]);

  useEffect(() => {
    if (improveEntireError) {
      toast.error("Failed to improve entire resume. Please try again.");
    }
  }, [improveEntireError]);

  useEffect(() => {
    if (generateSectionError) {
      toast.error("Failed to generate content. Please try again.");
    }
  }, [generateSectionError]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [improvingField, setImprovingField] = useState(null);

  // Overall AI operation status
  const isAnyAIOperationActive = isImproving || isImprovingEntire || isGeneratingSection || improvingField;

  // AI Improvement function
  const handleImproveWithAI = async (currentContent, type, fieldPath) => {
    if (!currentContent?.trim()) {
      toast.error(`Please add some ${type} content first`);
      return;
    }

    setImprovingField(fieldPath);
    try {
      const improved = await improveWithAIFn({ 
        current: currentContent, 
        type: type 
      });
      
      if (improved) {
        // Update the form field with improved content
        const fieldNames = fieldPath.split('.');
        if (fieldNames.length === 1) {
          setValue(fieldPath, improved);
        } else if (fieldNames.length === 2) {
          setValue(fieldPath, improved);
        }
        toast.success(`${type} improved successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to improve ${type}: ${error.message}`);
    } finally {
      setImprovingField(null);
    }
  };

  // Improve entire resume function
  const handleImproveEntireResume = async () => {
    if (!previewContent?.trim()) {
      toast.error("Please add some content to your resume first");
      return;
    }

    try {
      const improvedResume = await improveEntireResumeFn(previewContent);
      if (improvedResume) {
        setPreviewContent(improvedResume);
        toast.success("Entire resume improved successfully!");
      }
    } catch (error) {
      toast.error(`Failed to improve resume: ${error.message}`);
    }
  };

  // Generate content from scratch function
  const handleGenerateContent = async (section, fieldPath) => {
    setImprovingField(fieldPath);
    try {
      const generatedContent = await generateResumeSectionFn(section, {
        experience: user?.experience || 'entry level',
        bio: user?.bio || '',
        skills: user?.skills || []
      });
      
      if (generatedContent) {
        setValue(fieldPath, generatedContent);
        toast.success(`${section} generated successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to generate ${section}: ${error.message}`);
    } finally {
      setImprovingField(null);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      {/* AI Operation Status */}
      {isAnyAIOperationActive && (
        <div className="fixed top-4 right-4 z-50 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">AI is working...</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="font-bold gradient-title text-4xl md:text-5xl lg:text-6xl">
          Resume Builder
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={handleImproveEntireResume}
            disabled={isImprovingEntire || !previewContent?.trim()}
            className="flex items-center gap-2 justify-center"
            size="sm"
          >
            {isImprovingEntire ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Improving Resume...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Improve Entire Resume
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center gap-2 justify-center"
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="flex items-center gap-2 justify-center"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ATS Optimization Context */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">ATS Optimization Context</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAtsContext(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={atsContext.enabled ? "bg-blue-100 border-blue-300" : ""}
          >
            {atsContext.enabled ? "Disable ATS Mode" : "Enable ATS Mode"}
          </Button>
        </div>
        
        {atsContext.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-800">Target Role</label>
              <Input
                value={atsContext.targetRole}
                onChange={(e) => setAtsContext(prev => ({ ...prev, targetRole: e.target.value }))}
                placeholder="e.g., Senior Software Engineer"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-800">Company Name</label>
              <Input
                value={atsContext.companyName}
                onChange={(e) => setAtsContext(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g., Google, Microsoft"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-800">Job Description (Key Points)</label>
              <Textarea
                value={atsContext.jobDescription}
                onChange={(e) => setAtsContext(prev => ({ ...prev, jobDescription: e.target.value }))}
                placeholder="Paste key requirements from the job description..."
                className="h-20 border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
        )}
        
        {!atsContext.enabled && (
          <p className="text-sm text-blue-700">
            Enable ATS mode to get section-by-section optimization suggestions based on a specific job description and company.
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Professional Summary</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleImproveWithAI(watch("summary"), "Professional Summary", "summary")}
                  disabled={isImproving || !watch("summary")?.trim()}
                  className="flex items-center gap-2"
                >
                  {improvingField === "summary" ? (
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
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary that highlights your experience, key skills, and career objectives. Use 'Get AI Suggestions' below for help..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
              <AISuggestions
                section="Professional Summary"
                currentContent={watch("summary")}
                onApplySuggestion={(suggestion) => {
                  const currentSummary = watch("summary");
                  setValue("summary", currentSummary + "\n\n" + suggestion);
                }}
              />
              
              {/* ATS Optimization */}
              {atsContext.enabled && (
                <ATSOptimizer
                  sectionType="Professional Summary"
                  currentContent={watch("summary")}
                  jobDescription={atsContext.jobDescription}
                  targetRole={atsContext.targetRole}
                  companyName={atsContext.companyName}
                  onOptimizedContent={(optimized) => setValue("summary", optimized)}
                />
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Skills</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleImproveWithAI(watch("skills"), "Skills", "skills")}
                  disabled={isImproving || !watch("skills")?.trim()}
                  className="flex items-center gap-2"
                >
                  {improvingField === "skills" ? (
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
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your technical skills, programming languages, tools, and soft skills. Use 'Get AI Suggestions' below for additional ideas..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
              <AISuggestions
                section="Skills"
                currentContent={watch("skills")}
                onApplySuggestion={(suggestion) => {
                  const currentSkills = watch("skills");
                  setValue("skills", currentSkills + (currentSkills ? ", " : "") + suggestion);
                }}
              />
              
              {/* ATS Optimization */}
              {atsContext.enabled && (
                <ATSOptimizer
                  sectionType="Skills"
                  currentContent={watch("skills")}
                  jobDescription={atsContext.jobDescription}
                  targetRole={atsContext.targetRole}
                  companyName={atsContext.companyName}
                  onOptimizedContent={(optimized) => setValue("skills", optimized)}
                />
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Quick ATS Score */}
            <div className="lg:col-span-1">
              <QuickATSScore resumeContent={previewContent} />
            </div>
            
            {/* Resume Preview */}
            <div className="lg:col-span-3 space-y-4">
              {activeTab === "preview" && (
                <Button
                  variant="link"
                  type="button"
                  className="mb-2"
                  onClick={() =>
                    setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                  }
                >
                  {resumeMode === "preview" ? (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Resume
                    </>
                  ) : (
                    <>
                      <Monitor className="h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
              )}

              {activeTab === "preview" && resumeMode !== "preview" && (
                <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">
                    You will lose edited markdown if you update the form data.
                  </span>
                </div>
              )}
              
              <div className="border rounded-lg">
                <MDEditor
                  value={previewContent}
                  onChange={setPreviewContent}
                  height={800}
                  preview={resumeMode}
                />
              </div>
            </div>
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
