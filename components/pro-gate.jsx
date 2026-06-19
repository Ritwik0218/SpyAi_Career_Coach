"use client";

import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Wrap any PRO-only page with this component.
 * Pass `isPro={true/false}`. If free, shows a paywall overlay.
 * If PRO, renders children normally.
 */
export default function ProGate({ isPro, children, featureName = "This Feature" }) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      {/* Blurred background content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-30 blur-sm">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
        <div className="bg-primary/10 border border-primary/30 rounded-full p-5 mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">
          Unlock {featureName}
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          This is a <span className="text-primary font-semibold">SPY AI PRO</span> feature.
          Upgrade once and get lifetime access to all premium tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/pricing">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to PRO — ₹999
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
