"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  BarChart3,
  Shield,
  Handshake,
  FileSearch,
  Menu,
  X,
  Code2,
  Briefcase,
  Linkedin,
  User,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  {
    group: "Resume",
    items: [
      { href: "/resume", label: "Resume Builder", icon: FileText, description: "Live preview, PDF/Word export" },
      { href: "/resume/ats-analysis", label: "ATS Analyzer", icon: FileSearch, description: "Score & optimize any resume" },
    ],
  },
  {
    group: "Interview",
    items: [
      { href: "/coding-prep", label: "Coding Prep", icon: Code2, description: "SPY AI Algo Coach" },
      { href: "/interview", label: "Interview Prep", icon: GraduationCap, description: "Mock quizzes & performance tracking" },
      { href: "/interview/negotiation", label: "Salary Negotiator", icon: Handshake, description: "Real HR message coaching" },
    ],
  },
  {
    group: "More",
    items: [
      { href: "/job-tracker", label: "Job Tracker", icon: Briefcase, description: "Manage & track applications" },
      { href: "/ai-cover-letter", label: "Cover Letter", icon: PenBox, description: "AI-generated, fully editable" },
      { href: "/linkedin-optimizer", label: "LinkedIn Optimizer", icon: Linkedin, description: "Profile SEO & Visibility" },
      { href: "/networking", label: "Cold Emails", icon: PenBox, description: "AI Networking Email Generator" },
      { href: "/portfolio", label: "Portfolio Builder", icon: Globe, description: "1-Click Personal Website" },
      { href: "/offer-evaluator", label: "Offer Evaluator", icon: Calculator, description: "TC & Equity Math" },
      { href: "/dashboard", label: "Industry Insights", icon: BarChart3, description: "Salary trends & market data" },
    ],
  },
];

export default function Header() {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "007harshit.mathur.24@gmail.com";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" onClick={() => setMobileOpen(false)}>
          <Image
            src="/logo.png"
            alt="SPY AI Logo"
            width={200}
            height={60}
            className="h-10 md:h-12 py-1 w-auto object-contain"
            priority
            quality={90}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2">
          <SignedIn>
            {/* Admin badge */}
            {isAdmin && (
              <Link href="/admin/status">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 gap-1.5"
                >
                  <Shield className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Quick link: Industry Insights */}
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline">Industry Insights</span>
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-2">
                  <StarsIcon className="h-4 w-4" />
                  Growth Tools
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1.5">
                {NAV_ITEMS.map((group, gi) => (
                  <div key={gi}>
                    {gi > 0 && <DropdownMenuSeparator className="my-1" />}
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-2 py-1">
                      {group.group}
                    </DropdownMenuLabel>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.href} asChild className="rounded-lg py-2.5 px-2 cursor-pointer">
                          <Link href={item.href} className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none mb-0.5">{item.label}</p>
                              <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Profile Settings"
                  labelIcon={<User size={15} />}
                  href="/profile"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <SignedOut>
            <ThemeToggle />
            <SignInButton>
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile: user + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <SignedIn>
            {isAdmin && (
              <Link href="/admin/status">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-purple-400">
                  <Shield className="h-4 w-4 animate-pulse" />
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
            
            <UserButton
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              afterSignOutUrl="/"
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Profile Settings"
                  labelIcon={<User size={15} />}
                  href="/profile"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
          
          <SignedOut>
            <ThemeToggle />
          </SignedOut>

          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SignedIn>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <SignedIn>
        <div
          className={`md:hidden border-t border-muted/20 bg-background/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            {NAV_ITEMS.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "pt-3" : ""}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 px-2 pb-1 font-semibold">
                  {group.group}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}

            <div className="pt-3 border-t border-muted/20">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Industry Insights</p>
                  <p className="text-xs text-muted-foreground">Salary trends & market data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </SignedIn>
    </header>
  );
}
