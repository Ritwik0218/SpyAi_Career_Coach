"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import getGeminiModel from "@/lib/gemini";

export async function getJobApplications() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const jobs = await db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return jobs;
}

export async function createJobApplication(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const job = await db.jobApplication.create({
    data: {
      userId: user.id,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      url: data.url || null,
      salary: data.salary || null,
      location: data.location || null,
      notes: data.notes || null,
      status: data.status || "SAVED",
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      lastActionDate: new Date(),
    },
  });

  revalidatePath("/job-tracker");
  return job;
}

export async function updateJobStatus(id, newStatus) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const job = await db.jobApplication.update({
    where: { id },
    data: { 
      status: newStatus,
      lastActionDate: new Date()
    },
  });

  revalidatePath("/job-tracker");
  return job;
}

export async function updateJobDetails(id, data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const job = await db.jobApplication.update({
    where: { id },
    data: {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      url: data.url || null,
      salary: data.salary || null,
      location: data.location || null,
      notes: data.notes || null,
      status: data.status,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      lastActionDate: new Date(), // Any edit constitutes an action
    },
  });

  revalidatePath("/job-tracker");
  return job;
}

export async function deleteJobApplication(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.jobApplication.delete({
    where: { id },
  });

  revalidatePath("/job-tracker");
  return { success: true };
}

export async function generateTailoredResume(jobId, jobDescription) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { resume: true },
  });

  if (!user || !user.resume) {
    throw new Error("No base resume found. Please create a resume in the Builder first.");
  }

  const model = getGeminiModel();
  if (!model) {
    throw new Error("AI service unavailable.");
  }

  const prompt = `You are an expert ATS optimizer and career coach. 
I am providing you with my base resume in markdown and a specific target job description. 
Please rewrite my resume to highly align with the job description.
Highlight relevant skills, reword my experience to match the required keywords naturally (without fabricating facts), and ensure it is formatted cleanly in Markdown.

Base Resume:
${user.resume.content}

Target Job Description:
${jobDescription}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return { success: true, tailoredResume: text };
  } catch (error) {
    console.error("Gemini AI error:", error);
    if (error.message && error.message.includes("429 Too Many Requests")) {
      throw new Error("Gemini API Rate Limit Exceeded: Please wait about 1 minute before trying again.");
    }
    throw new Error("Failed to generate tailored resume.");
  }
}
