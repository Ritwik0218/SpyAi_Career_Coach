"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DashboardView from "./_component/dashboard-view";
import { getIndustryInsights } from "@/actions/dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

const COUNTRIES = [
  "Worldwide",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Germany",
  "Australia"
];

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("Worldwide");

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Load data immediately without blocking
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const insightsData = await getIndustryInsights(country);
        setInsights(insightsData);
      } catch (error) {
        console.log("Dashboard load error:", error);
        // Set default data on error matching the real schema
        setInsights({
          salaryRanges: [
            { role: "Junior Developer", min: 50000, max: 80000, median: 65000, location: country },
            { role: "Software Engineer", min: 80000, max: 130000, median: 105000, location: country },
            { role: "Senior Engineer", min: 120000, max: 180000, median: 150000, location: country },
            { role: "Engineering Manager", min: 150000, max: 220000, median: 185000, location: country },
            { role: "Software Architect", min: 160000, max: 250000, median: 200000, location: country }
          ],
          growthRate: 15.2,
          demandLevel: "High",
          topSkills: ["JavaScript", "React", "Python", "Cloud Computing", "System Design"],
          marketOutlook: "Positive",
          keyTrends: ["AI integration", "Cloud development", "Microservices"],
          recommendedSkills: ["TypeScript", "AWS", "Docker", "Kubernetes"],
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isSignedIn, isLoaded, router, country]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4 opacity-50 pointer-events-none">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <div className="w-[180px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* User Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "User Profile"} 
              className="w-14 h-14 rounded-full border border-white/10 shadow-[0_0_15px_rgba(79,70,229,0.15)] object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "User")}&background=4f46e5&color=fff&size=56`;
              }}
            />
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
            </h1>
            <p className="text-sm text-gray-400 font-medium">Here's your career intel for today.</p>
          </div>
        </div>

        {/* Country Selection Header */}
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-indigo-400" />
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-[200px] bg-black/40 border-white/10 backdrop-blur-sm focus:ring-indigo-500">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <Link href="/dashboard/career-bridge">
          <Button variant="outline" className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
            <Globe className="h-4 w-4" />
            Launch Career Bridge
          </Button>
        </Link>
      </div>

      <DashboardView insights={insights} />
    </div>
  );
}
