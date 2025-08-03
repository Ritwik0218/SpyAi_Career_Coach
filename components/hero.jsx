"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-36 lg:pt-48 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6 mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold animated-gradient-text leading-tight sm:leading-tight md:leading-tight">
              <span className="block sm:inline">Your AI Career Coach</span>
              <span className="block sm:inline"> for</span>
              <br className="hidden sm:block" />
              <span className="block">Professional Growth</span>
            </h1>
            <p className="mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[600px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-2 sm:px-0">
              Accelerate your career with personalized guidance, interview preparation, and
              AI-powered tools for professional success.
            </p>
          </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 button-premium focus-ring relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
            </Button>
          </Link>
          <Link href="/interview">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 card-lift focus-ring group relative overflow-hidden">
              <span className="relative z-10">Interview Prep</span>
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex justify-center items-center gap-1 sm:gap-3 mt-4 px-2 sm:px-0"
        >
          <Link href="/resume">
            <Button size="sm" variant="ghost" className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
              Build Resume
            </Button>
          </Link>
          <span className="text-muted-foreground text-xs sm:text-sm">•</span>
          <Link href="/resume/ats-analysis">
            <Button size="sm" variant="ghost" className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
              ATS Analyzer
            </Button>
          </Link>
          <span className="text-muted-foreground text-xs sm:text-sm">•</span>
          <Link href="/ai-cover-letter">
            <Button size="sm" variant="ghost" className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
              Cover Letter
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="hero-image-wrapper mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-0"
        >
          <div ref={imageRef} className="hero-image max-w-6xl mx-auto">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg sm:rounded-xl shadow-2xl border mx-auto w-full h-auto"
              priority
              quality={85}
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
