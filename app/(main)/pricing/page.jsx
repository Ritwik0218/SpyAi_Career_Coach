"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade.");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on our backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99900 }), // ₹999.00
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy", // Usually public key goes here
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SPY AI Career Coach",
        description: "Lifetime PRO Access",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.success("Payment Successful! You are now a PRO user.");
              router.refresh(); // Refresh to update user tier state globally
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#4f46e5", // Indigo/Royal Blue to match branding
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Invest in your career today. Unlock powerful AI tools designed to get you hired faster and negotiate higher salaries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE TIER */}
        <Card className="flex flex-col border-border/50 shadow-sm relative">
          <CardHeader>
            <CardTitle className="text-2xl">Essential</CardTitle>
            <CardDescription>Everything you need to start.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground"> / lifetime</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {["Resume Builder & ATS Scoring", "Basic Cover Letter Generator", "Job Application Tracker", "Industry Salary Insights", "Behavioral Interview Prep (Basic)"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* PRO TIER */}
        <Card className="flex flex-col border-primary/50 shadow-lg relative bg-primary/5">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Most Popular
            </span>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">SPY AI PRO</CardTitle>
            <CardDescription>The ultimate career acceleration toolkit.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹999</span>
              <span className="text-muted-foreground"> / one-time</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {["Everything in Essential", "AI Portfolio Website Generator", "Networking Cold Email Generator", "Offer Evaluator & Equity Math", "Advanced LinkedIn Optimization", "Unlimited AI Generations"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpgrade} disabled={loading} className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-md">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Processing..." : "Upgrade to PRO"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
