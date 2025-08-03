"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DashboardView from "./_component/dashboard-view";
import { getIndustryInsights, getUserStats } from "@/actions/dashboard-fast";
import { getUserOnboardingStatus } from "@/actions/user-fast";

// Loading component for better UX
function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-96 w-full bg-muted animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Load data immediately without blocking
    const loadDashboard = async () => {
      try {
        const [insightsData] = await Promise.all([
          getIndustryInsights(),
        ]);
        
        setInsights(insightsData);
      } catch (error) {
        console.log("Dashboard load error:", error);
        // Set default data on error
        setInsights({
          salaryRanges: [{ level: "Entry", range: "$50k - $70k" }],
          growthRate: 15.2,
          demandLevel: "High",
          topSkills: ["JavaScript", "React", "Python"],
          marketOutlook: "Strong growth in tech sector",
          keyTrends: ["AI integration", "Cloud development"],
          recommendedSkills: ["TypeScript", "AWS", "Docker"]
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || loading) {
    return <DashboardSkeleton />;
  }

  if (!isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <DashboardView insights={insights} />
    </div>
  );
}
