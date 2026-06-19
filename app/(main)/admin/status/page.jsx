"use client";

import React, { useState, useEffect } from "react";
import { getStatusMetrics } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Cpu, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock, Server } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function StatusPage() {
  const { user, isLoaded } = useUser();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchMetrics = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getStatusMetrics();
      setMetrics(data);
      setLastChecked(new Date().toLocaleTimeString());
      if (silent) {
        toast.success("Diagnostics refreshed successfully!");
      }
    } catch (err) {
      console.error("Failed to fetch latency metrics:", err);
      toast.error(err?.message || "Failed to load status metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress === "007harshit.mathur.24@gmail.com") {
      fetchMetrics();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-8 max-w-4xl space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Verifying authorization...</p>
      </div>
    );
  }

  if (user?.primaryEmailAddress?.emailAddress !== "007harshit.mathur.24@gmail.com") {
    return (
      <div className="container mx-auto py-8 max-w-4xl space-y-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <XCircle className="h-16 w-16 text-destructive mb-2" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          You are not authorized to view the system status diagnostics page.
        </p>
      </div>
    );
  }

  const getDbLatencyBadge = (latency) => {
    if (latency < 0) return <Badge variant="destructive">Offline</Badge>;
    if (latency < 100) return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Excellent ({latency}ms)</Badge>;
    if (latency < 300) return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">Normal ({latency}ms)</Badge>;
    return <Badge variant="destructive">High Latency ({latency}ms)</Badge>;
  };

  const getGeminiLatencyBadge = (latency, status) => {
    if (status === "inactive") return <Badge variant="outline" className="text-muted-foreground border-muted">Not Configured</Badge>;
    if (latency < 0) return <Badge variant="destructive">Offline</Badge>;
    if (latency < 800) return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Fast ({latency}ms)</Badge>;
    if (latency < 2000) return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">Normal ({latency}ms)</Badge>;
    return <Badge variant="destructive">Slow ({latency}ms)</Badge>;
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-title flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary animate-pulse" />
            System Status Checker
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Real-time latency metrics and connection checks for database and AI services.
          </p>
        </div>
        <Button
          onClick={() => fetchMetrics(true)}
          disabled={loading}
          variant="outline"
          className="gap-2 self-end sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Run Diagnostics
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse bg-muted/30">
              <div className="h-44" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Connection Card */}
            <Card className="border border-muted/50 bg-card/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Neon Database Connection
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Prisma Client Query Roundtrip
                  </CardDescription>
                </div>
                {metrics?.db?.status === "healthy" ? (
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" title="Online" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-destructive" title="Offline" />
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-muted/30">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-muted-foreground">Latency</span>
                  <span className="text-3xl font-extrabold tracking-tight">
                    {metrics?.db?.latency >= 0 ? `${metrics.db.latency} ms` : "—"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-muted-foreground/80" />
                    Status
                  </span>
                  {getDbLatencyBadge(metrics?.db?.latency)}
                </div>

                {metrics?.db?.error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded p-2 text-xs text-destructive mt-2 break-all">
                    <strong>Error:</strong> {metrics.db.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gemini API Card */}
            <Card className="border border-muted/50 bg-card/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-purple-500" />
                    Gemini AI API Connection
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Token Inference latency test
                  </CardDescription>
                </div>
                {metrics?.gemini?.status === "healthy" ? (
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" title="Healthy" />
                ) : metrics?.gemini?.status === "inactive" ? (
                  <div className="h-3 w-3 rounded-full bg-amber-500" title="Not Configured" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-destructive" title="Offline" />
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-muted/30">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-muted-foreground">Latency</span>
                  <span className="text-3xl font-extrabold tracking-tight">
                    {metrics?.gemini?.latency >= 0 ? `${metrics.gemini.latency} ms` : "—"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-muted-foreground/80" />
                    Status
                  </span>
                  {getGeminiLatencyBadge(metrics?.gemini?.latency, metrics?.gemini?.status)}
                </div>

                {metrics?.gemini?.error && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs text-amber-600 dark:text-amber-400 mt-2 break-words">
                    <strong>Notice:</strong> {metrics.gemini.error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground pt-4 gap-2 border-t border-muted/50">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last diagnostic test run: {lastChecked || "Never"}
            </span>
            <span>All latency tests measure end-to-end server execution time.</span>
          </div>

          {/* Diagnostic Info Collapsible */}
          <Card className="border border-muted/50 bg-card/40">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Developer Debugging Log
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0 text-xs font-mono bg-muted/20 border-t border-muted/10 p-4">
              <pre className="overflow-auto max-h-40 leading-relaxed text-muted-foreground">
                {JSON.stringify(metrics, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
