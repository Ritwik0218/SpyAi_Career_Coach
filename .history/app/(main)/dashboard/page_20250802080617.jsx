import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageTransition } from "@/components/page-transition";

// Add caching for better performance
export const revalidate = 3600; // Revalidate every hour

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

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <PageTransition className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </PageTransition>
  );
}

// Separate component for data fetching to enable better caching
async function DashboardContent() {
  const insights = await getIndustryInsights();
  return <DashboardView insights={insights} />;
}
