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

// Premium Feature Card Component
const FeatureCard = ({ feature, index }) => {
  return (
    <div className="relative group h-full">
      <Card className="relative h-full flex flex-col border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-out hover:border-white/20 hover:bg-white/[0.02]">
        
        {/* Ambient Top Glow on Hover */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500" />
        
        <CardContent className="p-8 flex flex-col items-center text-center relative z-10 flex-grow">
          {/* Elegant Icon Container */}
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-500 transform group-hover:scale-110 shadow-[0_0_0_rgba(79,70,229,0)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            {feature.icon}
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-white tracking-tight">
            {feature.title}
          </h3>
          
          <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
            {feature.description}
          </p>
        </CardContent>
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
    <section className="w-full py-16 md:py-24 bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2 drop-shadow-sm">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={800 + index * 50}
                />
              </div>
              <p className="text-gray-400 font-medium tracking-wide text-sm md:text-base uppercase">{stat.label}</p>
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-indigo-950/5 to-[#0A0A0A] opacity-50" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              The Engineering Toolkit
            </h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm md:text-base font-medium">
              Elite AI-powered tools covering every stage of your engineering job hunt — from your algorithms to your final offer.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full mt-6 opacity-80" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-white">How It Works</h2>
            <p className="text-gray-400 font-medium">
              Four structured phases to accelerate your engineering career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-white tracking-tight">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-indigo-500/30"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=4f46e5&color=fff&size=40`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-indigo-400 font-medium">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-gray-300 italic relative leading-relaxed">
                        <span className="text-4xl text-indigo-500/20 absolute -top-4 -left-4 font-serif">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-4xl text-indigo-500/20 absolute -bottom-6 -right-2 font-serif">
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
      <section className="w-full py-16 md:py-24 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold mb-4 text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 font-medium">
              Everything you need to know about the SPY AI Engine.
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
      <section className="w-full bg-[#0A0A0A] py-16 md:py-24 px-4">
        <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden relative border border-white/10 bg-black/50 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-20 px-6 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Command Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl font-medium">
              Build your resume, conquer your interviews, and negotiate top-tier compensation — powered by elite AI.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                className="h-14 mt-8 px-8 bg-white text-black hover:bg-gray-200 rounded-full font-semibold transition-all group shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <span>Initialize SPY AI Engine</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
