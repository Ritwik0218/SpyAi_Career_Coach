"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, Sparkles, CheckCircle2, Star, Timer, Trophy,
  FileText, Mail, Globe, Calculator, Linkedin, Brain, BarChart3,
  Briefcase, ChevronDown, Zap, Shield, Users, TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Data ───────────────────────────────────────────────────────
const FEATURES = [
  { icon: <FileText className="w-6 h-6" />, title: "AI Resume Builder", desc: "ATS-optimized resumes with real-time scoring. Beat the bots, impress the humans.", tag: "Free" },
  { icon: <Brain className="w-6 h-6" />, title: "Interview Coach", desc: "Practice behavioral & technical questions with live AI feedback.", tag: "Free" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Industry Insights", desc: "Real salary ranges, growth trends, and top skills — by role and city.", tag: "Free" },
  { icon: <Briefcase className="w-6 h-6" />, title: "Job Tracker", desc: "Track every application, interview, and follow-up in one command center.", tag: "Free" },
  { icon: <Globe className="w-6 h-6" />, title: "Portfolio Builder", desc: "Generate a stunning personal website from your resume in one click.", tag: "PRO" },
  { icon: <Mail className="w-6 h-6" />, title: "Cold Email Generator", desc: "AI-crafted outreach emails personalized to any company and hiring manager.", tag: "PRO" },
  { icon: <Linkedin className="w-6 h-6" />, title: "LinkedIn Optimizer", desc: "Upload your PDF export and get a detailed profile overhaul strategy.", tag: "PRO" },
  { icon: <Calculator className="w-6 h-6" />, title: "Offer Evaluator", desc: "Break down TC, equity, and bonuses. Get an AI negotiation email instantly.", tag: "PRO" },
];

const TESTIMONIALS = [
  { quote: "I applied to 12 companies and got 8 callbacks within 2 weeks. My resume's ATS score went from 52 to 94 using SPY AI.", author: "Arjun Sharma", role: "SDE-2 at Amazon", avatar: "AS", color: "from-blue-500 to-indigo-600" },
  { quote: "The cold email generator helped me land a referral at Google. The email was so good, the recruiter forwarded it directly to the hiring manager.", author: "Priya Patel", role: "Product Manager at Flipkart", avatar: "PP", color: "from-pink-500 to-rose-600" },
  { quote: "Used the offer evaluator before signing — negotiated ₹4.2L more in base salary. Best ₹999 I ever spent.", author: "Vikram Gupta", role: "Data Scientist at Swiggy", avatar: "VG", color: "from-purple-500 to-violet-600" },
  { quote: "Generated my portfolio in under 60 seconds. Sent the link in my email signature and got compliments from every interviewer.", author: "Neha Reddy", role: "Frontend Engineer at Razorpay", avatar: "NR", color: "from-emerald-500 to-teal-600" },
  { quote: "The behavioral interview prep felt like a real coaching session. It flagged weaknesses I didn't even know I had.", author: "Rahul Nair", role: "Engineering Manager at Zepto", avatar: "RN", color: "from-orange-500 to-amber-600" },
  { quote: "LinkedIn optimizer doubled my profile views in 3 weeks. I started getting inbound DMs from recruiters instead of chasing them.", author: "Sneha Iyer", role: "UX Designer at Meesho", avatar: "SI", color: "from-sky-500 to-cyan-600" },
];

const FAQS = [
  { q: "Is SPY AI free to use?", a: "Yes! The core tools — Resume Builder, Interview Coach, Job Tracker, and Industry Insights — are completely free forever. The PRO plan unlocks advanced features like the Portfolio Builder, Cold Email Generator, LinkedIn Optimizer, and Offer Evaluator." },
  { q: "What does the PRO plan cost?", a: "SPY AI PRO is a one-time payment of ₹999 — not a monthly subscription. Pay once, get lifetime access to all current and future PRO features." },
  { q: "Does it work for non-tech jobs too?", a: "Absolutely. SPY AI works for any industry — tech, finance, marketing, design, consulting, and more. The AI adapts its advice based on your specific role and industry." },
  { q: "How is this different from ChatGPT?", a: "ChatGPT is a general-purpose assistant. SPY AI is purpose-built for career growth — with structured tools, resume parsing, ATS scoring, salary data, and a complete workflow built around getting you hired faster." },
  { q: "Is my resume data private?", a: "Yes. Your data is encrypted, stored securely in a private database, and never shared or sold. Only you can access your resume and application data." },
  { q: "Can I upgrade later?", a: "Yes, anytime. Start free and upgrade when you're ready. Your data is always preserved." },
];

const COMPANIES = ["Google", "Amazon", "Microsoft", "Flipkart", "Razorpay", "Swiggy", "Zepto", "Meesho", "Paytm", "Infosys"];

// ─── Countdown Timer ─────────────────────────────────────────────
function useCountdown() {
  const getEndTime = () => {
    if (typeof window === "undefined") return new Date();
    const stored = localStorage.getItem("spyai_launch_end");
    if (stored) return new Date(stored);
    const end = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
    localStorage.setItem("spyai_launch_end", end.toISOString());
    return end;
  };

  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const end = getEndTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft({ h: "00", m: "00", s: "00" }); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── Counter Animation ────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const id = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(id); }
          else setCount(Math.floor(start));
        }, 20);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Page ────────────────────────────────────────────────────
export default function LandingPage() {
  const { h, m, s } = useCountdown();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">

      {/* ── Launch Offer Banner ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-2.5 px-4 text-center text-sm font-medium">
        <span className="mr-2">🔥 Launch Offer — PRO at just</span>
        <span className="font-black text-yellow-300">₹999 (Regular ₹2,999)</span>
        <span className="mx-2">· Ends in</span>
        <span className="font-mono font-black text-yellow-300">{h}:{m}:{s}</span>
        <Link href="/pricing" className="ml-3 underline underline-offset-2 hover:text-yellow-300 transition-colors">Grab it →</Link>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Google Gemini AI
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Land Your Dream Job
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              10× Faster with AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            SPY AI is the all-in-one career acceleration platform — resume builder, interview coach, portfolio generator, salary negotiator, and more. Built for India's top talent.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all duration-300 rounded-xl font-bold">
                Start Free — No Credit Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 text-white hover:bg-white/5 rounded-xl font-semibold backdrop-blur-sm">
                View PRO Features
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-gray-400 text-sm">
            {["✅ Free forever plan", "✅ No subscription — Pay once", "✅ Privacy-first"].map((t, i) => (
              <span key={i} className="font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-600" />
        </div>
      </section>

      {/* ── Social Proof Stats ── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: 2400, suffix: "+", label: "Professionals Joined" },
            { n: 8500, suffix: "+", label: "Resumes Generated" },
            { n: 94, suffix: "%", label: "Avg ATS Score Increase" },
            { n: 999, suffix: "", label: "One-time PRO Price (₹)" },
          ].map(({ n, suffix, label }, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                <AnimatedCounter target={n} suffix={suffix} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hired At Banner ── */}
      <section className="py-10 px-4 overflow-hidden">
        <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-widest mb-8">Users hired at top companies</p>
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <span key={i} className="text-gray-600 font-bold text-lg hover:text-gray-400 transition-colors cursor-default flex-shrink-0">{c}</span>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
              <Zap className="h-3.5 w-3.5" />
              Everything You Need
            </div>
            <h2 className="text-4xl md:text-5xl font-black">Your Entire Career, One Platform</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">8 powerful AI tools working together to get you hired faster and paid more.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 cursor-default">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    {f.icon}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.tag === "PRO" ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              Real Results, Real People
            </div>
            <h2 className="text-4xl md:text-5xl font-black">They Got Hired. Now It's Your Turn.</h2>
          </div>

          {/* Featured Testimonial */}
          <div className="relative mb-8 p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden min-h-[220px] transition-all duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].color} opacity-5`} />
            <div className="relative z-10 max-w-3xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-2xl md:text-3xl font-semibold text-white leading-relaxed mb-8">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].color} flex items-center justify-center font-black text-lg`}>
                  {TESTIMONIALS[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="font-bold text-white">{TESTIMONIALS[activeTestimonial].author}</p>
                  <p className="text-gray-400 text-sm">{TESTIMONIALS[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-6 h-2 bg-indigo-400" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-1 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500">
            <div className="rounded-[22px] bg-[#080818] p-10 md:p-16 text-center space-y-8">
              {/* Countdown */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium">
                <Timer className="h-4 w-4 animate-pulse" />
                <span>Launch price ends in</span>
                <span className="font-mono font-black text-white">{h}:{m}:{s}</span>
              </div>

              <div>
                <h2 className="text-4xl md:text-6xl font-black mb-4">
                  Everything for
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">₹999</span>
                  <span className="text-gray-600 line-through text-3xl ml-4">₹2,999</span>
                </h2>
                <p className="text-gray-400 text-xl">One-time payment. Lifetime access. No hidden fees.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
                {["Portfolio Builder", "Cold Email Generator", "LinkedIn Optimizer", "Offer & Equity Evaluator", "Unlimited AI Generations", "All Future PRO Features"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/pricing">
                  <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_50px_rgba(99,102,241,0.4)] rounded-xl font-black transition-all duration-300">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to PRO — ₹999
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 rounded-xl font-semibold">
                    Start Free First
                  </Button>
                </Link>
              </div>

              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Secure payment via Razorpay · 100% encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">Frequently Asked</h2>
            <p className="text-gray-400 text-xl">Everything you need to know before getting started.</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-white/5 bg-white/[0.02] rounded-xl px-6 data-[state=open]:border-indigo-500/30">
                <AccordionTrigger className="text-left font-semibold text-white hover:no-underline hover:text-indigo-300 transition-colors py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black">
            Your Next Offer is
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Waiting For You</span>
          </h2>
          <p className="text-xl text-gray-400">Join 2,400+ professionals already accelerating their careers with SPY AI.</p>
          <Link href="/sign-up">
            <Button size="lg" className="h-16 px-12 text-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_60px_rgba(99,102,241,0.4)] rounded-2xl font-black transition-all duration-300">
              Get Started Free
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
          <p className="text-gray-600 text-sm">No credit card required · Free plan available forever</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-4 text-center text-gray-600 text-sm">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
          <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
          <Link href="/sign-in" className="hover:text-gray-400 transition-colors">Sign In</Link>
        </div>
        <p>© 2025 SPY AI Career Coach · Built for India's Top Talent</p>
      </footer>

      {/* ── Marquee CSS ── */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
