"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveResume } from "@/actions/resume-fast";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import { EntryForm } from "./entry-form";
import { AISuggestions } from "./ai-suggestions";
import { QuickATSScore } from "./quick-ats-score-v2";
import { EnhancedATSOptimizer } from "./enhanced-ats-optimizer-v2";

// Dynamic imports for client-side only libraries
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-48 sm:h-56 lg:h-64 bg-muted animate-pulse rounded" />
});

const MarkdownPreview = dynamic(() => import("@uiw/react-md-editor").then(mod => ({ default: mod.default.Markdown })), {
  ssr: false,
  loading: () => <div className="h-48 sm:h-56 lg:h-64 bg-muted animate-pulse rounded" />
});

/**
 * Professional Resume Builder v2 - Enhanced SPY AI Career Coach
 * 
 * Features:
 * - Mobile-first responsive design with modern UI
 * - Real-time preview with live updates
 * - ATS optimization with Gemini AI integration
 * - Comprehensive sections: Contact, Summary, Experience, Education, Skills, Projects
 * - AI-powered suggestions for each section
 * - Download options (PDF/Word) for regular and ATS-optimized versions
 * - Auto-save functionality every 30 seconds
 * - Keyboard navigation (Alt+Arrow keys, Ctrl/Cmd+S to save)
 * - Professional theme aligned with dashboard/cover letter styling
 * - Error handling with user-friendly messages
 * - Accessibility features and proper form validation
 * 
 * @param {Object} initialContent - Pre-loaded resume data from database
 */
export default function ProfessionalResumeBuilder({ initialContent }) {
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [currentSection, setCurrentSection] = useState("contact");
  const [isMobile, setIsMobile] = useState(false);
  
  // ATS Context - Simplified and professional
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

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

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
      // Auto-hide ATS panel on mobile for better UX
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
          handleSubmit(onSubmit)().catch(() => {
            // Silent auto-save failure
          });
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [formValues, isSaving, handleSubmit]);

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

  // Define navigation functions first
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

  // Define form submission handler
  const onSubmit = useCallback(async (data) => {
    try {
      await saveResumeFn({
        userId: user.id,
        content: data,
      });
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.error("Failed to save resume");
      throw error;
    }
  }, [saveResumeFn, user.id]);

  // Accessibility: Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Right Arrow: Next section
      if (e.altKey && e.key === 'ArrowRight' && currentSectionIndex < sections.length - 1) {
        e.preventDefault();
        goToNextSection();
      }
      // Alt + Left Arrow: Previous section
      if (e.altKey && e.key === 'ArrowLeft' && currentSectionIndex > 0) {
        e.preventDefault();
        goToPrevSection();
      }
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const submitHandler = handleSubmit(onSubmit);
        submitHandler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, sections.length, goToNextSection, goToPrevSection, onSubmit, handleSubmit]);

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

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
  };

  // Download functions
  const downloadAsPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary element with the resume content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; margin-bottom: 10px;">${user?.fullName || 'Your Name'}</h1>
            <div style="margin-bottom: 20px;">
              ${formValues.contactInfo?.email ? `📧 ${formValues.contactInfo.email}` : ''}
              ${formValues.contactInfo?.mobile ? ` | 📱 ${formValues.contactInfo.mobile}` : ''}
              ${formValues.contactInfo?.linkedin ? ` | 💼 LinkedIn` : ''}
            </div>
          </div>
          ${formValues.summary ? `<div style="margin-bottom: 20px;"><h2>Professional Summary</h2><p>${formValues.summary}</p></div>` : ''}
          ${formValues.skills ? `<div style="margin-bottom: 20px;"><h2>Skills</h2><p>${formValues.skills}</p></div>` : ''}
          ${formValues.experience?.length ? `<div style="margin-bottom: 20px;"><h2>Work Experience</h2>${formValues.experience.map(exp => `<div style="margin-bottom: 15px;"><h3>${exp.position} at ${exp.company}</h3><p><strong>Duration:</strong> ${exp.duration}</p><p>${exp.description}</p></div>`).join('')}</div>` : ''}
          ${formValues.education?.length ? `<div style="margin-bottom: 20px;"><h2>Education</h2>${formValues.education.map(edu => `<div style="margin-bottom: 15px;"><h3>${edu.degree} - ${edu.institution}</h3><p><strong>Duration:</strong> ${edu.duration}</p><p>${edu.description}</p></div>`).join('')}</div>` : ''}
          ${formValues.projects?.length ? `<div style="margin-bottom: 20px;"><h2>Projects</h2>${formValues.projects.map(proj => `<div style="margin-bottom: 15px;"><h3>${proj.title}</h3><p><strong>Technologies:</strong> ${proj.technologies}</p><p>${proj.description}</p></div>`).join('')}</div>` : ''}
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      document.body.removeChild(tempDiv);
      
      // Use canvas.toBlob() to avoid large string serialization
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imgData = reader.result;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            
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
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { text-align: center; margin-bottom: 10px; }
              h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .contact { text-align: center; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .entry { margin-bottom: 15px; }
              .entry h3 { margin-bottom: 5px; }
              .entry p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>${user?.fullName || 'Your Name'}</h1>
            <div class="contact">
              ${formValues.contactInfo?.email ? `📧 ${formValues.contactInfo.email}` : ''}
              ${formValues.contactInfo?.mobile ? ` | 📱 ${formValues.contactInfo.mobile}` : ''}
              ${formValues.contactInfo?.linkedin ? ` | 💼 LinkedIn` : ''}
            </div>
            ${formValues.summary ? `<div class="section"><h2>Professional Summary</h2><p>${formValues.summary}</p></div>` : ''}
            ${formValues.skills ? `<div class="section"><h2>Skills</h2><p>${formValues.skills}</p></div>` : ''}
            ${formValues.experience?.length ? `<div class="section"><h2>Work Experience</h2>${formValues.experience.map(exp => `<div class="entry"><h3>${exp.position} at ${exp.company}</h3><p><strong>Duration:</strong> ${exp.duration}</p><p>${exp.description}</p></div>`).join('')}</div>` : ''}
            ${formValues.education?.length ? `<div class="section"><h2>Education</h2>${formValues.education.map(edu => `<div class="entry"><h3>${edu.degree} - ${edu.institution}</h3><p><strong>Duration:</strong> ${edu.duration}</p><p>${edu.description}</p></div>`).join('')}</div>` : ''}
            ${formValues.projects?.length ? `<div class="section"><h2>Projects</h2>${formValues.projects.map(proj => `<div class="entry"><h3>${proj.title}</h3><p><strong>Technologies:</strong> ${proj.technologies}</p><p>${proj.description}</p></div>`).join('')}</div>` : ''}
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

  // Handle optimized resume from ATS Optimizer
  const handleOptimizedResume = (optimizedContent) => {
    // Parse the optimized content and update form values
    try {
      // For now, we'll put the optimized content in the summary
      // In a more sophisticated version, we'd parse it into sections
      setValue("summary", optimizedContent);
      toast.success("Optimized resume content applied!");
    } catch (error) {
      console.error("Error applying optimized resume:", error);
      toast.error("Failed to apply optimized content");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile First */}
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
              {/* ATS Panel Toggle - Desktop */}
              <Button
                variant={showATSPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowATSPanel(!showATSPanel)}
                className="hidden sm:flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                ATS Score
              </Button>
              
              {/* Mobile ATS Toggle */}
              <Button
                variant={showATSPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowATSPanel(!showATSPanel)}
                className="sm:hidden"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              
              {/* Download Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Download</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={downloadAsPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadAsWord}>
                    <File className="h-4 w-4 mr-2" />
                    Download as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Save Button */}
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                size="sm"
                className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
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
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    ATS Optimization
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowATSPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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

        {/* Main Content - Mobile First Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Form Section */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg text-foreground">Build Your Resume</CardTitle>
                  <div className="flex items-center gap-2">
                    {isMobile && (
                      <span className="text-sm text-muted-foreground">
                        {currentSectionIndex + 1} of {sections.length}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Section Navigation */}
                {isMobile && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevSection}
                        disabled={currentSectionIndex === 0}
                        className="px-3"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex-1 mx-3 sm:mx-4">
                        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
                          {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                              <Button
                                key={section.id}
                                variant={currentSection === section.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleSectionChange(section.id)}
                                className="flex-shrink-0 min-w-0"
                              >
                                <Icon className="h-4 w-4 mr-1" />
                                <span className="truncate">{section.shortLabel}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <Progress 
                          value={((currentSectionIndex + 1) / sections.length) * 100} 
                          className="mt-2 h-1"
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextSection}
                        disabled={currentSectionIndex === sections.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Desktop Tabs */}
                <Tabs value={currentSection} onValueChange={setCurrentSection} className="hidden sm:block">
                  <TabsList className="grid w-full grid-cols-6 mb-6">
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

                  {/* Contact Information */}
                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          {...register("contactInfo.email")}
                          name="email"
                          placeholder="Email Address *"
                          type="email"
                          autoComplete="email"
                          className="w-full"
                        />
                        {errors.contactInfo?.email && (
                          <p className="text-sm text-red-600 mt-1" role="alert">Email is required</p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register("contactInfo.mobile")}
                          name="mobile"
                          placeholder="Phone Number *"
                          type="tel"
                          autoComplete="tel"
                          className="w-full"
                        />
                        {errors.contactInfo?.mobile && (
                          <p className="text-sm text-red-600 mt-1" role="alert">Phone number is required</p>
                        )}
                      </div>
                      <Input
                        {...register("contactInfo.linkedin")}
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        type="url"
                        autoComplete="url"
                        className="w-full"
                      />
                      <Input
                        {...register("contactInfo.twitter")}
                        name="twitter"
                        placeholder="Twitter/X URL (Optional)"
                        type="url"
                        autoComplete="url"
                        className="w-full"
                      />
                    </div>
                  </TabsContent>

                  {/* Professional Summary */}
                  <TabsContent value="summary" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          {...register("summary")}
                          name="summary"
                          placeholder="Write a compelling professional summary that highlights your key achievements and skills. Focus on what makes you unique and valuable to employers..."
                          className="min-h-[120px] w-full resize-none"
                          rows={5}
                        />
                        {errors.summary && (
                          <p className="text-sm text-red-600 mt-1" role="alert">Summary is required</p>
                        )}
                      </div>
                      <AISuggestions
                        section="Summary"
                        currentContent={formValues.summary}
                        onApplySuggestion={(content) => setValue("summary", content)}
                      />
                    </div>
                  </TabsContent>

                  {/* Experience */}
                  <TabsContent value="experience" className="space-y-4">
                    <EntryForm
                      control={control}
                      fieldName="experience"
                      formValues={formValues}
                      setValue={setValue}
                      type="experience"
                      title="Work Experience"
                      fields={[
                        { name: "company", placeholder: "Company Name *", required: true },
                        { name: "position", placeholder: "Job Title *", required: true },
                        { name: "location", placeholder: "Location" },
                        { name: "duration", placeholder: "Duration (e.g., Jan 2020 - Present)" },
                        { name: "description", placeholder: "Describe your key responsibilities, achievements, and impact. Use action verbs and quantify results where possible...", type: "textarea" },
                      ]}
                    />
                  </TabsContent>

                  {/* Education */}
                  <TabsContent value="education" className="space-y-4">
                    <EntryForm
                      control={control}
                      fieldName="education"
                      formValues={formValues}
                      setValue={setValue}
                      type="education"
                      title="Education"
                      fields={[
                        { name: "institution", placeholder: "Institution Name *", required: true },
                        { name: "degree", placeholder: "Degree/Certification *", required: true },
                        { name: "field", placeholder: "Field of Study" },
                        { name: "duration", placeholder: "Duration (e.g., 2018-2022)" },
                        { name: "description", placeholder: "Notable achievements, GPA (if 3.5+), relevant coursework, honors, etc...", type: "textarea" },
                      ]}
                    />
                  </TabsContent>

                  {/* Skills */}
                  <TabsContent value="skills" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          {...register("skills")}
                          name="skills"
                          placeholder="List your technical and professional skills. Organize them by category for better readability:

Technical Skills: JavaScript, Python, React, Node.js, SQL
Tools & Platforms: Git, Docker, AWS, Figma
Soft Skills: Project Management, Team Leadership, Problem Solving"
                          className="min-h-[120px] w-full resize-none"
                          rows={6}
                        />
                        {errors.skills && (
                          <p className="text-sm text-red-600 mt-1" role="alert">Skills are required</p>
                        )}
                      </div>
                      <AISuggestions
                        section="Skills"
                        currentContent={formValues.skills}
                        onApplySuggestion={(content) => setValue("skills", content)}
                      />
                    </div>
                  </TabsContent>

                  {/* Projects */}
                  <TabsContent value="projects" className="space-y-4">
                    <EntryForm
                      control={control}
                      fieldName="projects"
                      formValues={formValues}
                      setValue={setValue}
                      type="projects"
                      title="Projects"
                      fields={[
                        { name: "title", placeholder: "Project Title *", required: true },
                        { name: "technologies", placeholder: "Technologies Used" },
                        { name: "link", placeholder: "Project URL/GitHub Link" },
                        { name: "duration", placeholder: "Duration (e.g., 3 months)" },
                        { name: "description", placeholder: "Describe the project, your role, challenges solved, and key achievements. Include metrics if possible...", type: "textarea" },
                      ]}
                    />
                  </TabsContent>
                </Tabs>

                {/* Mobile Content - Show current section only */}
                <div className="sm:hidden">
                  {currentSection === "contact" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <Input
                          {...register("contactInfo.email")}
                          name="email"
                          placeholder="Email Address *"
                          type="email"
                          autoComplete="email"
                          className="w-full"
                        />
                        <Input
                          {...register("contactInfo.mobile")}
                          name="mobile"
                          placeholder="Phone Number *"
                          type="tel"
                          autoComplete="tel"
                          className="w-full"
                        />
                        <Input
                          {...register("contactInfo.linkedin")}
                          name="linkedin"
                          placeholder="LinkedIn URL"
                          type="url"
                          autoComplete="url"
                          className="w-full"
                        />
                        <Input
                          {...register("contactInfo.twitter")}
                          name="twitter"
                          placeholder="Twitter/X URL (Optional)"
                          type="url"
                          autoComplete="url"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {currentSection === "summary" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Professional Summary</h3>
                      <Textarea
                        {...register("summary")}
                        name="summary"
                        placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
                        className="min-h-[120px] w-full resize-none"
                        rows={5}
                      />
                      <AISuggestions
                        section="Summary"
                        currentContent={formValues.summary}
                        onApplySuggestion={(content) => setValue("summary", content)}
                      />
                    </div>
                  )}

                  {currentSection === "skills" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Skills</h3>
                      <Textarea
                        {...register("skills")}
                        name="skills"
                        placeholder="List your technical and professional skills..."
                        className="min-h-[120px] w-full resize-none"
                        rows={6}
                      />
                      <AISuggestions
                        section="Skills"
                        currentContent={formValues.skills}
                        onApplySuggestion={(content) => setValue("skills", content)}
                      />
                    </div>
                  )}

                  {currentSection === "experience" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Work Experience</h3>
                      <EntryForm
                        control={control}
                        fieldName="experience"
                        formValues={formValues}
                        setValue={setValue}
                        type="experience"
                        title="Work Experience"
                        fields={[
                          { name: "company", placeholder: "Company Name *", required: true },
                          { name: "position", placeholder: "Job Title *", required: true },
                          { name: "location", placeholder: "Location" },
                          { name: "duration", placeholder: "Duration (e.g., Jan 2020 - Present)" },
                          { name: "description", placeholder: "Describe your key responsibilities and achievements...", type: "textarea" },
                        ]}
                      />
                    </div>
                  )}

                  {currentSection === "education" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Education</h3>
                      <EntryForm
                        control={control}
                        fieldName="education"
                        formValues={formValues}
                        setValue={setValue}
                        type="education"
                        title="Education"
                        fields={[
                          { name: "institution", placeholder: "Institution Name *", required: true },
                          { name: "degree", placeholder: "Degree/Certification *", required: true },
                          { name: "field", placeholder: "Field of Study" },
                          { name: "duration", placeholder: "Duration (e.g., 2018-2022)" },
                          { name: "description", placeholder: "Notable achievements, coursework, honors...", type: "textarea" },
                        ]}
                      />
                    </div>
                  )}

                  {currentSection === "projects" && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Projects</h3>
                      <EntryForm
                        control={control}
                        fieldName="projects"
                        formValues={formValues}
                        setValue={setValue}
                        type="projects"
                        title="Projects"
                        fields={[
                          { name: "title", placeholder: "Project Title *", required: true },
                          { name: "technologies", placeholder: "Technologies Used" },
                          { name: "link", placeholder: "Project URL/GitHub Link" },
                          { name: "duration", placeholder: "Duration" },
                          { name: "description", placeholder: "Describe the project and your contributions...", type: "textarea" },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - Mobile First */}
          <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
            <Card className="bg-card border-border shadow-lg lg:sticky lg:top-24">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-lg text-foreground">Live Preview</CardTitle>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-background border-border border rounded-lg p-3 lg:p-4 max-h-[300px] sm:max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                  <div className="space-y-3 lg:space-y-4">
                    {/* Contact Info */}
                    <div className="text-center border-b border-border pb-4">
                      <h1 className="text-lg sm:text-xl font-bold text-foreground">
                        {user?.fullName || 'Your Name'}
                      </h1>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        {formValues.contactInfo?.email && (
                          <div>📧 {formValues.contactInfo.email}</div>
                        )}
                        {formValues.contactInfo?.mobile && (
                          <div>📱 {formValues.contactInfo.mobile}</div>
                        )}
                        {formValues.contactInfo?.linkedin && (
                          <div>💼 LinkedIn</div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {formValues.summary && (
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Professional Summary</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{formValues.summary}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {formValues.skills && (
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Skills</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{formValues.skills}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {formValues.experience?.length > 0 && (
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Work Experience</h2>
                        <div className="space-y-3">
                          {formValues.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary/30 pl-3">
                              <h3 className="font-medium text-foreground">
                                {exp.position} at {exp.company}
                              </h3>
                              {exp.duration && (
                                <p className="text-xs text-muted-foreground">{exp.duration}</p>
                              )}
                              {exp.description && (
                                <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {formValues.education?.length > 0 && (
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Education</h2>
                        <div className="space-y-2">
                          {formValues.education.map((edu, index) => (
                            <div key={index}>
                              <h3 className="font-medium text-foreground">
                                {edu.degree} - {edu.institution}
                              </h3>
                              {edu.duration && (
                                <p className="text-xs text-muted-foreground">{edu.duration}</p>
                              )}
                              {edu.description && (
                                <p className="text-sm text-muted-foreground">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {formValues.projects?.length > 0 && (
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Projects</h2>
                        <div className="space-y-2">
                          {formValues.projects.map((project, index) => (
                            <div key={index}>
                              <h3 className="font-medium text-foreground">{project.title}</h3>
                              {project.technologies && (
                                <p className="text-xs text-muted-foreground">Tech: {project.technologies}</p>
                              )}
                              {project.description && (
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
