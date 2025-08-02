"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl animated-gradient-text">
            Your AI Career Coach for
            <br />
            Professional Growth
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Accelerate your career with personalized guidance, interview preparation, and
            AI-powered tools for professional success.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 button-premium focus-ring relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
            </Button>
          </Link>
          <Link href="/interview">
            <Button size="lg" variant="outline" className="px-8 card-lift focus-ring group relative overflow-hidden">
              <span className="relative z-10">Interview Prep</span>
            </Button>
          </Link>
        </div>
        
        {/* Quick Access Resume Tools */}
        <div className="flex justify-center space-x-3 mt-4">
          <Link href="/resume">
            <Button size="sm" variant="ghost" className="px-4 text-sm">
              Build Resume
            </Button>
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/resume/ats-analysis">
            <Button size="sm" variant="ghost" className="px-4 text-sm">
              ATS Analyzer
            </Button>
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/ai-cover-letter">
            <Button size="sm" variant="ghost" className="px-4 text-sm">
              Cover Letter
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
