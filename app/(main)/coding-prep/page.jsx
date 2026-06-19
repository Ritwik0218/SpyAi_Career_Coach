"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProblemsByCategory } from "@/actions/coding-prep";
import { categories } from "@/data/neetcode150";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react";

export default function CodingPrepDashboard() {
  const [solvedIds, setSolvedIds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spyai_solved_problems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await getProblemsByCategory();
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  const totalProblems = problems.length;
  const solvedCount = solvedIds.length;
  const progressPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading Problem Database...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-muted/20 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-title flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            Coding Prep (SPY AI Algo Coach)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Master Data Structures and Algorithms with our integrated AI Tutor and Code Execution environment.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-black text-primary">{progressPct}%</div>
          <div className="text-sm text-muted-foreground">{solvedCount} / {totalProblems} Solved</div>
        </div>
      </div>

      {/* Problems List Grouped by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryProblems = problems.filter(p => p.category === category);
          if (categoryProblems.length === 0) return null;

          const solvedInCategory = categoryProblems.filter(p => solvedIds.includes(p.id)).length;

          return (
            <Card key={category} className="border border-muted/40 bg-card/60">
              <CardHeader className="pb-3 border-b border-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">{category}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {solvedInCategory} / {categoryProblems.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/20">
                  {categoryProblems.map(problem => {
                    const isSolved = solvedIds.includes(problem.id);
                    return (
                      <Link 
                        key={problem.id} 
                        href={`/coding-prep/${problem.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {isSolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-sm md:text-base">{problem.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
                                'bg-red-500/10 text-red-400 border-red-400/20'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                          Solve <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
