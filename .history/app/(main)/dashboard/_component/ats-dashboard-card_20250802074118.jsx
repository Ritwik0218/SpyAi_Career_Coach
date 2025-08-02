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
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-blue-900 text-base md:text-lg">ATS Resume Analyzer</CardTitle>
              <p className="text-xs md:text-sm text-blue-700">Professional Resume Optimization</p>
            </div>
          </div>
          <Badge variant="default" className="bg-blue-600 w-fit">
            New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-800 leading-relaxed">
          Analyze your resume against job descriptions and achieve 90+ ATS compatibility scores 
          with AI-powered optimization suggestions.
        </p>
        
        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Real-time ATS score analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Keyword optimization suggestions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Section-by-section improvements</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Industry benchmarking</span>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-900">95%</span>
            </div>
            <p className="text-xs text-blue-600">Max ATS Score</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-700">+35</span>
            </div>
            <p className="text-xs text-blue-600">Avg Improvement</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-lg font-bold text-purple-700">A+</span>
            </div>
            <p className="text-xs text-blue-600">Grade Rating</p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
          <p className="text-xs text-green-800 font-medium">
            💼 Users report 3x more interview calls after optimization
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href="/resume/ats-analysis" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Zap className="h-4 w-4 mr-2" />
              Start ATS Analysis
            </Button>
          </Link>
          <Link href="/resume">
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
