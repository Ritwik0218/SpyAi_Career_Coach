"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

// Enhanced Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Symmetric wave animation - cards glow in sequence
    const symmetricGlow = () => {
      const baseDelay = 8000; // 8 seconds cycle
      const waveDelay = index * 400; // 400ms between each card
      
      setTimeout(() => {
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 1800); // Glow for 1.8 seconds
        
        // Schedule next wave cycle
        setTimeout(symmetricGlow, baseDelay);
      }, waveDelay);
    };

    // Start the symmetric wave after initial delay
    setTimeout(symmetricGlow, 2000 + index * 400);
  }, [index]);

  return (
    <div className="relative group">
      {/* Symmetric outer glow ring */}
      <div className={`absolute -inset-1 rounded-xl transition-all duration-500 ${
        isGlowing || isHovered 
          ? 'bg-gradient-to-r from-primary/60 via-blue-500/60 to-primary/60 opacity-100 blur-sm' 
          : 'opacity-0'
      } ${isGlowing ? 'animate-pulse' : ''}`} />
      
      <Card
        className={`relative border-2 transition-all duration-300 ease-out transform cursor-pointer h-full flex flex-col card-lift
          ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100'}
          ${isGlowing ? 'border-primary/80 shadow-2xl shadow-primary/40 scale-105' : 'border-border hover:border-primary/50'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Symmetric background gradient */}
        <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
          isHovered 
            ? 'bg-gradient-to-br from-primary/10 via-blue-500/5 to-primary/10 opacity-100' 
            : 'opacity-0'
        }`} />
        
        {/* Coordinated shimmer effect */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isGlowing ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-r from-transparent via-white/25 to-transparent transform skew-x-12 animate-shimmer`} />
        
        <CardContent className="pt-6 text-center flex flex-col items-center relative z-10 flex-grow">
          <div className="flex flex-col items-center justify-center h-full">
            {/* Symmetric icon container */}
            <div className={`mb-4 p-4 rounded-xl transition-all duration-300 transform
              ${isHovered ? 'bg-primary/30 scale-110' : 'bg-primary/10'}
              ${isGlowing ? 'bg-primary/40 scale-110' : ''}
            `}>
              <div className={`transition-all duration-300 ${
                isHovered || isGlowing ? 'text-primary scale-110' : ''
              }`}>
                {feature.icon}
              </div>
            </div>
            
            <h3 className={`text-xl font-bold mb-2 transition-all duration-300 ${
              isHovered || isGlowing ? 'text-primary scale-105' : ''
            }`}>
              {feature.title}
            </h3>
            
            <p className={`text-muted-foreground transition-all duration-300 flex-grow flex items-center ${
              isHovered || isGlowing ? 'text-foreground/90' : ''
            }`}>
              {feature.description}
            </p>
          </div>
        </CardContent>
        
        {/* Symmetric corner sparkles */}
        <div className={`absolute top-2 right-2 w-2 h-2 bg-primary rounded-full transition-all duration-300 ${
          isGlowing ? 'opacity-100 animate-ping' : 'opacity-0'
        }`} />
        <div className={`absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full transition-all duration-500 ${
          isGlowing ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`} />
        <div className={`absolute bottom-2 right-2 w-1.5 h-1.5 bg-primary/60 rounded-full transition-all duration-400 ${
          isGlowing ? 'opacity-100 animate-bounce' : 'opacity-0'
        }`} />
        <div className={`absolute bottom-2 left-2 w-1.5 h-1.5 bg-blue-500/60 rounded-full transition-all duration-600 ${
          isGlowing ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`} />
      </Card>
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef} className="text-4xl font-bold">
      {count}{suffix}
    </span>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { value: 50, suffix: "+", label: "Industries Covered" },
    { value: 1000, suffix: "+", label: "Interview Questions" },
    { value: 95, suffix: "%", label: "Success Rate" },
    { value: 24, suffix: "/7", label: "AI Support" },
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <AnimatedCounter 
                end={stat.value} 
                suffix={stat.suffix}
                duration={800 + index * 50}
              />
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-50" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Powerful Features for Your Career Growth
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=3b82f6&color=fff&size=40`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-11 mt-5 button-premium focus-ring group relative overflow-hidden float-animation"
              >
                <span className="relative z-10">Start Your Journey Today</span>
                <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
