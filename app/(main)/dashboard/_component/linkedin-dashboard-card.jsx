"use client";

import Link from "next/link";
import { 
  Linkedin, 
  Search, 
  LineChart, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LinkedInDashboardCard() {
  return (
    <Card className="bg-black/40 border-white/5 backdrop-blur-sm hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(10,102,194,0.1)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(10,102,194,0.1)]">
              <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-[#0A66C2]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-white text-base md:text-lg font-bold tracking-tight">LinkedIn Optimizer Engine</CardTitle>
              <p className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">Profile SEO & Visibility</p>
            </div>
          </div>
          <Badge variant="default" className="bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 hover:bg-[#0A66C2]/30 w-fit">
            New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 relative z-10">
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          Supercharge your inbound recruiter pipeline. Our AI analyzes your profile PDF to rank you higher in LinkedIn Recruiter search results.
        </p>
        
        {/* Features */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0A66C2] flex-shrink-0" />
            <span>Headline keyword optimization</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0A66C2] flex-shrink-0" />
            <span>Summary & 'About' section rewrites</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0A66C2] flex-shrink-0" />
            <span>Experience impact metric extraction</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0A66C2] flex-shrink-0" />
            <span>Skill taxonomy alignment</span>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-[#0A66C2]" />
              <span className="text-base md:text-lg font-bold text-white">4x</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Search Apps</p>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="flex items-center justify-center gap-1.5">
              <LineChart className="h-3.5 w-3.5 text-green-400" />
              <span className="text-base md:text-lg font-bold text-white">+50%</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Profile Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-base md:text-lg font-bold text-white">Inbound</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">Leads</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-white/5 mt-2">
          <Link href="/linkedin-optimizer" className="flex-1">
            <Button className="w-full bg-[#0A66C2] text-white hover:bg-[#004182] text-sm font-semibold h-11 rounded-lg">
              <Zap className="h-4 w-4 mr-2" />
              Start LinkedIn Scan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
