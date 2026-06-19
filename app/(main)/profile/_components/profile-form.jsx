"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkillSelector from "@/components/ui/skill-selector";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser, clearUserCareerData } from "@/actions/user";

export default function ProfileForm({ initialData, industries }) {
  const router = useRouter();

  // The DB stores industry as "tech-software-engineering". We need to reverse engineer it for the default values.
  let defaultIndustry = "";
  let defaultSubIndustry = "";
  
  if (initialData?.industry) {
    // Attempt to match the exact string format "industryId-sub-industry"
    for (const ind of industries) {
      if (initialData.industry.startsWith(ind.id + "-")) {
        defaultIndustry = ind.id;
        const subslug = initialData.industry.replace(ind.id + "-", "");
        // Find the actual subIndustry string that matches the slug
        const match = ind.subIndustries.find(sub => sub.toLowerCase().replace(/ /g, "-") === subslug);
        if (match) {
          defaultSubIndustry = match;
        }
        break;
      }
    }
  }

  const [selectedIndustry, setSelectedIndustry] = useState(
    industries.find((ind) => ind.id === defaultIndustry) || null
  );

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const [isClearing, setIsClearing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: defaultIndustry,
      subIndustry: defaultSubIndustry,
      experience: initialData?.experience?.toString() || "0",
      bio: initialData?.bio || "",
      skills: initialData?.skills || [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear your career data? You will need to complete onboarding again.")) {
      return;
    }
    
    setIsClearing(true);
    try {
      await clearUserCareerData();
      toast.success("Career data cleared.");
      router.push("/onboarding");
    } catch (error) {
      toast.error("Failed to clear data.");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          Career Trajectory
        </CardTitle>
        <CardDescription>
          Keep your industry and skills up to date to get the best AI recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={watchIndustry}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  value={watch("subIndustry")}
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              placeholder="e.g., 5"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Professional Skills</Label>
            <SkillSelector
              id="skills"
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little about your professional background..."
              className="h-32"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-white/5">
        <Button 
          type="button" 
          variant="destructive" 
          onClick={handleClearData}
          disabled={isClearing || updateLoading}
        >
          {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Reset Career Data
        </Button>
        <Button 
          type="submit" 
          form="profile-form" 
          disabled={updateLoading || isClearing}
          className="bg-primary text-primary-foreground font-bold"
        >
          {updateLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
