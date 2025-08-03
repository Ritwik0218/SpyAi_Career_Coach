import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.array(z.string()).min(1, "Please add at least one skill").max(20, "Maximum 20 skills allowed"),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

// Base entry schema with common fields
const baseEntrySchema = z.object({
  description: z.string().optional(),
  duration: z.string().optional(),
});

// Experience-specific schema
export const experienceSchema = baseEntrySchema.extend({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
});

// Education-specific schema  
export const educationSchema = baseEntrySchema.extend({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
});

// Project-specific schema
export const projectSchema = baseEntrySchema.extend({
  title: z.string().min(1, "Title is required"),
  technologies: z.string().optional(),
  link: z.string().optional(),
});

// Legacy entry schema for backward compatibility
export const entrySchema = z
  .object({
    title: z.string().optional(),
    organization: z.string().optional(),
    company: z.string().optional(),
    institution: z.string().optional(),
    position: z.string().optional(),
    degree: z.string().optional(),
    field: z.string().optional(),
    location: z.string().optional(),
    technologies: z.string().optional(),
    link: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    duration: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().default(false),
  });

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().optional(),
  skills: z.string().optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
