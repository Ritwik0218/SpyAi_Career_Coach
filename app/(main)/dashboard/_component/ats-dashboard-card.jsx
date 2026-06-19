"use client";

import Link from "next/link";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ATSDashboardCard() {
  return (
    <Card className="bg-black/40 border-white/5 backdrop-blur-sm hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-white text-base md:text-lg font-bold tracking-tight">ATS Analyzer Engine</CardTitle>
              <p className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">Automated Resume Optimization</p>
            </div>
          </div>
          <Badge variant="default" className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 w-fit">
            System Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 relative z-10">
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          Deploy AI to reverse-engineer Applicant Tracking Systems. Scan your resume against job descriptions to achieve a 90+ match index.
        </p>
        
        {/* Features */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span>Real-time ATS parsing algorithm</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span>Semantic keyword gap analysis</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span>Section-by-section code-level fixes</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span>FAANG-grade industry benchmarking</span>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-base md:text-lg font-bold text-white">95%</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Match Index</p>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="flex items-center justify-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              <span className="text-base md:text-lg font-bold text-white">+35</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Avg Boost</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-base md:text-lg font-bold text-white">A+</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Grade</p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-xl mt-2">
          <p className="text-[11px] md:text-xs text-indigo-300 font-medium flex items-center gap-2">
            <Zap className="h-3 w-3 text-indigo-400" />
            Users report 3x higher callback rates post-optimization
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          <Link href="/resume/ats-analysis" className="flex-1">
            <Button className="w-full bg-white text-black hover:bg-gray-200 text-sm font-semibold h-11 rounded-lg">
              <Zap className="h-4 w-4 mr-2" />
              Initialize Analysis
            </Button>
          </Link>
          <Link href="/resume">
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-11 w-11 rounded-lg">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
