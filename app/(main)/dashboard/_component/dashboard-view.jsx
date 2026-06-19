"use client";

import React, { lazy, Suspense } from "react";
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ATSDashboardCard } from "./ats-dashboard-card";
import { LinkedInDashboardCard } from "./linkedin-dashboard-card";

// Loading component for chart
function ChartSkeleton() {
  return <div className="h-full w-full bg-muted animate-pulse rounded-lg" />;
}

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="w-fit">Last updated: {lastUpdatedDate}</Badge>
          <AdminLink />
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px] w-full">
            <Suspense fallback={<ChartSkeleton />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}k`}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl">
                            <p className="font-semibold text-sm mb-2">{label}</p>
                            <div className="space-y-1">
                              {payload.map((item) => (
                                <p key={item.name} className="text-xs flex items-center justify-between gap-4">
                                  <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="h-2 w-2 rounded-full" style={{ background: item.color || item.fill }}></span>
                                    {item.name}:
                                  </span>
                                  <span className="font-medium text-foreground">${item.value}k</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="min" 
                    fill="url(#colorMin)" 
                    name="Min Salary" 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar 
                    dataKey="median" 
                    fill="url(#colorMedian)" 
                    name="Median Salary" 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar 
                    dataKey="max" 
                    fill="url(#colorMax)" 
                    name="Max Salary" 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Elite Toolkit Section */}
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">The Engineering Toolkit</h2>
          <p className="text-gray-400 font-medium text-sm md:text-base">Elite AI-powered systems to command your career progression</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <ATSDashboardCard />
          <LinkedInDashboardCard />
        </div>
      </div>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;

function AdminLink() {
  // Client-side admin check. Expose admin config via NEXT_PUBLIC_ env vars.
  const { userId } = useAuth();
  const { user } = useUser();

  const adminIds = (process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  const isAdminById = userId && adminIds.includes(userId);
  const email = user?.primaryEmail?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || user?.email;
  const isAdminByEmail = email && adminEmails.includes(String(email).toLowerCase());

  const isAdmin = isAdminById || isAdminByEmail;
  if (!isAdmin) return null;

  return (
    <Link href="/admin/fallbacks" className="text-sm text-primary underline">Admin: Fallbacks</Link>
  );
}
