"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Handshake, FileText, FileSearch, Terminal, PenBox, BarChart3, ChevronRight } from "lucide-react";

const QUICK_LINKS = [
  { href: "/coding-prep", label: "Algorithm Coach", icon: Terminal },
  { href: "/resume/ats-analysis", label: "ATS Analyzer", icon: FileSearch },
  { href: "/interview/negotiation", label: "Salary Coach", icon: Handshake },
  { href: "/ai-cover-letter", label: "Cover Letter", icon: PenBox },
  { href: "/dashboard", label: "Insights", icon: BarChart3 },
];

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;
    const handleScroll = () => {
      if (window.scrollY > 100) imageElement.classList.add("scrolled");
      else imageElement.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-40 lg:pt-52 pb-16 sm:pb-20 lg:pb-24 overflow-hidden bg-[#0A0A0A]">
      
      {/* Ambient Premium Background Glows */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 text-center">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-8 mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm font-medium text-indigo-300 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              SPY AI Engine 2.0 is Live
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.1] md:leading-[1.1]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">Master Your Code.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400">Command Your Career.</span>
            </h1>
            
            <p className="mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[700px] text-base sm:text-lg md:text-xl text-gray-400 font-medium px-2 sm:px-0">
              The ultimate arsenal for software engineers. Ace algorithmic interviews, bypass the ATS, and negotiate top-tier compensation—powered by elite AI insights.
            </p>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 sm:px-0"
          >
            <Link href="/coding-prep">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-full group">
                Start Coding Prep
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/interview/negotiation">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md rounded-full transition-all group">
                <Handshake className="mr-2 h-4 w-4 text-indigo-400" />
                Try Salary Coach
              </Button>
            </Link>
          </motion.div>

          {/* Quick Links Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-6 px-2"
          >
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <React.Fragment key={link.href}>
                  {i > 0 && <span className="text-white/20 text-xs hidden sm:inline">|</span>}
                  <Link href={link.href}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                </React.Fragment>
              );
            })}
          </motion.div>

          {/* Floating Code Snippet Graphic */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-[-2%] xl:left-[-5%] top-[60%] z-30 pointer-events-none"
          >
            <div className="w-[340px] rounded-xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden text-left">
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-[11px] text-gray-500 font-mono tracking-wider">spy_ai_engine.py</span>
              </div>
              <div className="p-5 text-[13px] font-mono leading-loose">
                <div className="flex text-indigo-400"><span className="text-gray-600 mr-4 select-none">1</span><span>class</span>&nbsp;<span className="text-yellow-200">SpyAIEngine</span>:</div>
                <div className="flex"><span className="text-gray-600 mr-4 select-none">2</span><span className="text-gray-300">&nbsp;&nbsp;def __init__(self):</span></div>
                <div className="flex"><span className="text-gray-600 mr-4 select-none">3</span><span className="text-green-400">&nbsp;&nbsp;&nbsp;&nbsp;self.status = "Optimal"</span></div>
                <div className="flex"><span className="text-gray-600 mr-4 select-none">4</span><span className="text-sky-300">&nbsp;&nbsp;&nbsp;&nbsp;self.analyze_ats()</span></div>
                <div className="flex"><span className="text-gray-600 mr-4 select-none">5</span><span className="text-sky-300">&nbsp;&nbsp;&nbsp;&nbsp;self.prep_algorithm()</span></div>
                <div className="flex"><span className="text-gray-600 mr-4 select-none">6</span><span className="text-violet-400">&nbsp;&nbsp;&nbsp;&nbsp;return self.land_offer()</span></div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 md:px-0 perspective-[2000px]"
          >
            <div ref={imageRef} className="relative max-w-6xl mx-auto rounded-xl sm:rounded-2xl border border-white/10 bg-black/50 p-2 sm:p-4 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-out transform rotate-x-[2deg]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-20 pointer-events-none rounded-2xl" />
              <Image
                src="/banner.jpeg"
                width={1280}
                height={720}
                alt="SPY AI Career Coach Dashboard Preview"
                className="rounded-lg shadow-2xl border border-white/5 w-full h-auto relative z-10"
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
