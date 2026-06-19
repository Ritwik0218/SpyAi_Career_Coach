"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initNegotiationTraining, analyzeRealHRMessage } from "@/actions/negotiation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Award, Loader2, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, ThumbsUp, ChevronRight, Lightbulb, MessageSquare,
  TrendingUp, Target, BookOpen, Handshake, Brain, Sparkles,
  ClipboardPaste, Zap, Eye, Info,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Constants ─────────────────────────────────────────────────── */
const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", CAD: "C$", AUD: "A$" };
const QUALITY_POINTS = { excellent: 20, good: 14, neutral: 8, poor: 0 };

const QUALITY_CONFIG = {
  excellent: {
    border: "border-emerald-500/70", bg: "bg-emerald-500/10", text: "text-emerald-400",
    icon: <CheckCircle className="h-4 w-4 shrink-0" />,
  },
  good: {
    border: "border-blue-400/70", bg: "bg-blue-500/10", text: "text-blue-400",
    icon: <ThumbsUp className="h-4 w-4 shrink-0" />,
  },
  neutral: {
    border: "border-yellow-400/70", bg: "bg-yellow-500/10", text: "text-yellow-400",
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
  },
  poor: {
    border: "border-red-500/70", bg: "bg-red-500/10", text: "text-red-400",
    icon: <XCircle className="h-4 w-4 shrink-0" />,
  },
};

const STAGE_ICONS = {
  1: <Award className="h-4 w-4" />,
  2: <Target className="h-4 w-4" />,
  3: <BookOpen className="h-4 w-4" />,
  4: <TrendingUp className="h-4 w-4" />,
  5: <Handshake className="h-4 w-4" />,
};

/* ─── Score helper ───────────────────────────────────────────────── */
function computeFinalScore(rounds, roundChoices) {
  let total = 0;
  roundChoices.forEach((choiceId, idx) => {
    const choice = rounds[idx]?.choices.find((c) => c.id === choiceId);
    total += QUALITY_POINTS[choice?.quality] || 0;
  });
  const max = rounds.length * 20;
  const pct = Math.round((total / max) * 100);
  if (pct >= 85) return { pct, grade: "Expert Negotiator", color: "text-emerald-400", border: "border-emerald-500/60", bg: "bg-emerald-500/10" };
  if (pct >= 65) return { pct, grade: "Skilled Negotiator", color: "text-blue-400", border: "border-blue-500/60", bg: "bg-blue-500/10" };
  if (pct >= 45) return { pct, grade: "Developing Skills", color: "text-yellow-400", border: "border-yellow-500/60", bg: "bg-yellow-500/10" };
  return { pct, grade: "Keep Practising", color: "text-red-400", border: "border-red-500/60", bg: "bg-red-500/10" };
}

/* ─── Shared choice card (used by both modes) ────────────────────── */
function ChoiceCard({ choice, isSelected, revealed, onSelect }) {
  const qConfig = QUALITY_CONFIG[choice.quality] || QUALITY_CONFIG.neutral;

  if (!revealed) {
    return (
      <button
        onClick={() => onSelect(choice.id)}
        className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-primary bg-primary/10 shadow-md scale-[1.01]"
            : "border-muted/50 bg-card/60 hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className={`h-6 w-6 rounded-full border-2 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/40 text-muted-foreground"
          }`}>{choice.id}</span>
          <p className={`text-sm leading-relaxed ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {choice.text}
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className={`rounded-xl border p-3.5 ${qConfig.border} ${qConfig.bg} ${isSelected ? "ring-2 ring-offset-1 ring-offset-background ring-primary/60" : "opacity-80"}`}>
      <div className="flex items-start gap-3">
        <span className={`h-6 w-6 rounded-full border-2 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${qConfig.border} ${qConfig.text}`}>
          {choice.id}
        </span>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <p className="text-sm text-foreground leading-relaxed">{choice.text}</p>
            {isSelected && (
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary">Your Pick</span>
            )}
          </div>
          <div className={`flex items-center gap-1.5 ${qConfig.text}`}>
            {qConfig.icon}
            <span className="text-xs font-bold">{choice.verdictLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{choice.explanation}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Coaching panel (used by both modes) ────────────────────────── */
function CoachingPanel({ round, selectedChoiceId, onNext, nextLabel }) {
  const bestChoice = round.choices.find((c) => c.id === round.bestChoiceId);
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {selectedChoiceId !== round.bestChoiceId && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-1.5">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Strongest Response
          </p>
          <p className="text-sm text-foreground italic">"{bestChoice?.text}"</p>
          <p className="text-xs text-muted-foreground">{bestChoice?.explanation}</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3" /> What To Say
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{round.whatToSay}</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-2">
          <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="h-3 w-3" /> What Not To Say
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{round.whatNotToSay}</p>
        </div>
      </div>
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
        <Lightbulb className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">{round.proTip}</p>
      </div>
      {onNext && (
        <Button onClick={onNext} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm gap-2">
          {nextLabel} <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SHARED CONFIG FORM FIELDS
══════════════════════════════════════════════════════════════════ */
function ConfigFields({ role, setRole, company, setCompany, currency, setCurrency, country, setCountry, stateRegion, setStateRegion, initialOffer, setInitialOffer, targetSalary, setTargetSalary }) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Target Company</Label>
          <Input placeholder="e.g. Infosys, Google" value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Job Title / Role</Label>
          <Input placeholder="e.g. Software Engineer" value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="AUD">AUD (A$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Country</Label>
          <Input placeholder="e.g. India" value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">State / Region</Label>
          <Input placeholder="e.g. Haryana" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className="rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Current Offer ({sym}/yr)</Label>
          <Input type="number" value={initialOffer} onChange={(e) => setInitialOffer(e.target.value)} className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Target Salary ({sym}/yr)</Label>
          <Input type="number" value={targetSalary} onChange={(e) => setTargetSalary(e.target.value)} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REAL COACH — Single round of coaching for a pasted HR message
══════════════════════════════════════════════════════════════════ */
function RealCoachMode({ commonConfig }) {
  const [hrText, setHrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleAnalyze = async () => {
    if (!hrText.trim()) { toast.error("Please paste what HR said."); return; }
    if (!commonConfig.role.trim() || !commonConfig.company.trim()) {
      toast.error("Please fill in your Role and Company first."); return;
    }
    setLoading(true);
    setResult(null);
    setSelectedChoiceId(null);
    setRevealed(false);
    try {
      const data = await analyzeRealHRMessage({
        hrMessage: hrText,
        ...commonConfig,
      });
      setResult(data);
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedChoiceId(null);
    setRevealed(false);
    setHrText("");
  };

  const stageTagColors = {
    "Opening Offer": "bg-blue-500/10 text-blue-400 border-blue-400/30",
    "Final Offer": "bg-orange-500/10 text-orange-400 border-orange-400/30",
    "Pressure Tactic": "bg-red-500/10 text-red-400 border-red-400/30",
    "Pushback": "bg-yellow-500/10 text-yellow-400 border-yellow-400/30",
    "Counter Negotiation": "bg-purple-500/10 text-purple-400 border-purple-400/30",
    "Benefits Discussion": "bg-emerald-500/10 text-emerald-400 border-emerald-400/30",
  };

  return (
    <div className="space-y-4">
      {/* Input box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <ClipboardPaste className="h-4 w-4 text-primary" />
            Paste What HR Said
          </Label>
          {hrText && !loading && (
            <button onClick={() => setHrText("")} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
          )}
        </div>
        <Textarea
          placeholder={`Paste the exact message HR/Recruiter sent or said to you...\n\ne.g. "We're pleased to offer you ₹18 LPA for this role. This is our standard package for this level. Can we proceed?"`}
          value={hrText}
          onChange={(e) => setHrText(e.target.value)}
          className="min-h-[120px] rounded-xl text-sm resize-none border-primary/20 focus:border-primary/60 bg-background"
          disabled={loading}
        />
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3" />
          The more accurate the paste, the more precise the AI coaching. Include exact words HR used.
        </p>
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={loading || !hrText.trim()}
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm gap-2 disabled:opacity-40"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Analysing HR message...</>
        ) : (
          <><Brain className="h-4 w-4" /> Analyse & Get My Response Options</>
        )}
      </Button>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
          {/* HR message echo + stage tag */}
          <div className="rounded-xl border border-muted/40 bg-card/80 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> HR Said
              </p>
              <span className={`text-[11px] font-bold border px-2 py-0.5 rounded-full ${stageTagColors[result.negotiationStage] || "bg-muted text-muted-foreground border-border"}`}>
                {result.negotiationStage}
              </span>
            </div>
            <p className="text-sm text-foreground italic leading-relaxed">"{result.hrMessage}"</p>
          </div>

          {/* Situation analysis */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> What HR is Actually Doing
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{result.situationAnalysis}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">HR's intent: </span>{result.hrIntent}
            </p>
          </div>

          {/* Choice question */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              {revealed ? "Here's how each response would land:" : "How would you respond?"}
            </p>
            <div className="grid gap-2.5">
              {result.choices.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  isSelected={selectedChoiceId === choice.id}
                  revealed={revealed}
                  onSelect={setSelectedChoiceId}
                />
              ))}
            </div>
          </div>

          {!revealed && (
            <Button
              onClick={() => {
                if (!selectedChoiceId) { toast.error("Select a response first."); return; }
                setRevealed(true);
              }}
              disabled={!selectedChoiceId}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm gap-2 disabled:opacity-40"
            >
              See How This Lands <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {revealed && (
            <div className="space-y-3">
              <CoachingPanel round={result} selectedChoiceId={selectedChoiceId} />
              <Button onClick={handleReset} variant="outline" className="w-full h-10 rounded-xl gap-2">
                <RotateCcw className="h-4 w-4" /> Paste Another HR Message
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function NegotiationPage() {
  /* Shared config state */
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [initialOffer, setInitialOffer] = useState("800000");
  const [targetSalary, setTargetSalary] = useState("1200000");
  const [currency, setCurrency] = useState("INR");
  const [country, setCountry] = useState("India");
  const [stateRegion, setStateRegion] = useState("Haryana");

  /* Mode toggle */
  const [activeMode, setActiveMode] = useState("real"); // "real" | "training"

  /* Training session state */
  const [session, setSession] = useState(null);
  const [loadingTraining, setLoadingTraining] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [roundChoices, setRoundChoices] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const commonConfig = { role, company, currentOffer: initialOffer, targetSalary, currency, country, state: stateRegion };

  /* ── Training handlers ──────────────────────────────────────── */
  const handleStartTraining = async (e) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) { toast.error("Please enter Role and Company."); return; }
    setLoadingTraining(true);
    try {
      const data = await initNegotiationTraining({ role, company, currentOffer: initialOffer, targetSalary, currency, country, state: stateRegion });
      setSession(data);
      setCurrentRoundIndex(0);
      setRoundChoices([]);
      setSelectedChoiceId(null);
      setRevealed(false);
      setSessionComplete(false);
    } catch { toast.error("Failed to start training. Please try again."); }
    finally { setLoadingTraining(false); }
  };

  const handleReveal = () => {
    if (!selectedChoiceId) { toast.error("Please select a response first."); return; }
    setRevealed(true);
    setRoundChoices((prev) => [...prev, selectedChoiceId]);
  };

  const handleNext = () => {
    if (currentRoundIndex < session.rounds.length - 1) {
      setCurrentRoundIndex((i) => i + 1);
      setSelectedChoiceId(null);
      setRevealed(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleResetTraining = () => {
    setSession(null);
    setCurrentRoundIndex(0);
    setSelectedChoiceId(null);
    setRevealed(false);
    setRoundChoices([]);
    setSessionComplete(false);
  };

  /* ════════════════════════════════════════════════════════════
     TRAINING: Final Score Screen
  ════════════════════════════════════════════════════════════ */
  if (session && sessionComplete) {
    const score = computeFinalScore(session.rounds, roundChoices);
    return (
      <div className="container mx-auto py-8 max-w-2xl space-y-6">
        <Card className="border border-muted/50 shadow-xl bg-card/80 backdrop-blur">
          <CardHeader className="text-center border-b border-muted/20 pb-5">
            <CardTitle className="text-3xl font-extrabold gradient-title">Training Complete!</CardTitle>
            <CardDescription>Negotiation training for <strong>{session.role}</strong> at <strong>{session.company}</strong></CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-7">
            <div className="flex flex-col items-center gap-2">
              <div className={`h-28 w-28 rounded-full border-4 ${score.border} ${score.bg} flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-black ${score.color}`}>{score.pct}</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">/ 100</span>
              </div>
              <span className={`text-base font-bold ${score.color}`}>{score.grade}</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Round by Round</h3>
              {session.rounds.map((round, idx) => {
                const choiceId = roundChoices[idx];
                const choice = round.choices.find((c) => c.id === choiceId);
                const qConfig = QUALITY_CONFIG[choice?.quality] || QUALITY_CONFIG.neutral;
                const points = QUALITY_POINTS[choice?.quality] || 0;
                return (
                  <div key={idx} className={`flex items-start gap-3 rounded-xl border ${qConfig.border} ${qConfig.bg} p-3`}>
                    <span className={`mt-0.5 ${qConfig.text}`}>{qConfig.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-foreground">{round.stageIcon} {round.stageName}</span>
                        <span className={`text-xs font-black ${qConfig.text}`}>+{points} pts</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">You chose: "{choice?.text}"</p>
                      <span className={`text-[11px] font-semibold ${qConfig.text}`}>{choice?.verdictLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Top Negotiation Principles
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Always ask for the full package before committing to any offer.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Back every counter with market data and quantified achievements.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> When base salary is fixed, negotiate signing bonus, review timeline, and perks.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Close warmly and professionally — your relationship with the employer starts now.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="border-t border-muted/20 pt-4 gap-3">
            <Button onClick={handleResetTraining} className="flex-1 rounded-lg gap-2" variant="outline">
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Link href="/interview" className="flex-1">
              <Button className="w-full rounded-lg bg-primary text-white gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Prep
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     TRAINING: Round Screen
  ════════════════════════════════════════════════════════════ */
  if (session) {
    const round = session.rounds[currentRoundIndex];
    const totalRounds = session.rounds.length;
    return (
      <div className="container mx-auto py-6 max-w-2xl space-y-4">
        <div className="flex items-center justify-between px-1">
          <Button variant="ghost" onClick={handleResetTraining} className="gap-2 text-muted-foreground px-0 text-sm">
            <ArrowLeft className="h-4 w-4" /> Exit Training
          </Button>
          <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
            Stage {currentRoundIndex + 1} of {totalRounds}
          </span>
        </div>
        <div className="flex gap-1.5 items-center">
          {session.rounds.map((r, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                idx < currentRoundIndex ? "bg-primary" : idx === currentRoundIndex ? "bg-primary/60" : "bg-muted"
              }`} />
              <span className={`text-[9px] font-semibold uppercase tracking-wider hidden sm:block ${idx === currentRoundIndex ? "text-primary" : "text-muted-foreground/50"}`}>
                {r.stageName}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            {STAGE_ICONS[round.stageNumber]} {round.stageIcon} {round.stageName}
          </span>
        </div>
        <Card className="border border-muted/40 bg-card/80 backdrop-blur shadow-lg">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-base">👔</div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">HR Recruiter · {session.company}</p>
                <p className="text-sm text-foreground leading-relaxed">{round.hrMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <p className="text-sm font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            {revealed ? "Here's how each response would land:" : "How would you respond?"}
          </p>
          <div className="grid gap-2.5">
            {round.choices.map((choice) => (
              <ChoiceCard key={choice.id} choice={choice} isSelected={selectedChoiceId === choice.id} revealed={revealed} onSelect={(id) => { if (!revealed) setSelectedChoiceId(id); }} />
            ))}
          </div>
        </div>
        {!revealed && (
          <Button onClick={handleReveal} disabled={!selectedChoiceId} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm gap-2 disabled:opacity-40">
            See How This Lands <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {revealed && (
          <CoachingPanel
            round={round}
            selectedChoiceId={selectedChoiceId}
            onNext={handleNext}
            nextLabel={currentRoundIndex < totalRounds - 1 ? "Next Stage" : "See My Score"}
          />
        )}
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     CONFIG + MODE SCREEN (Home)
  ════════════════════════════════════════════════════════════ */
  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <Link href="/interview">
        <Button variant="link" className="gap-2 pl-0 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Interview Prep
        </Button>
      </Link>

      <Card className="border border-muted/50 shadow-xl bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight gradient-title flex items-center gap-2.5">
            <Handshake className="h-7 w-7 text-primary" />
            Negotiation Coach
          </CardTitle>
          <CardDescription>
            Learn exactly what to say — and what not to say — in real salary negotiations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* ── Shared config ─────────────────────────────────── */}
          <ConfigFields
            role={role} setRole={setRole}
            company={company} setCompany={setCompany}
            currency={currency} setCurrency={setCurrency}
            country={country} setCountry={setCountry}
            stateRegion={stateRegion} setStateRegion={setStateRegion}
            initialOffer={initialOffer} setInitialOffer={setInitialOffer}
            targetSalary={targetSalary} setTargetSalary={setTargetSalary}
          />

          {/* ── Mode selector ─────────────────────────────────── */}
          <div className="rounded-xl border border-muted/40 overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveMode("real")}
                className={`flex flex-col items-center gap-1.5 px-4 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeMode === "real"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Brain className="h-5 w-5" />
                <span>Real HR Message</span>
                <span className={`text-[10px] font-normal ${activeMode === "real" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  Paste what HR actually said
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("training")}
                className={`flex flex-col items-center gap-1.5 px-4 py-4 text-sm font-semibold transition-all duration-200 border-l border-muted/40 ${
                  activeMode === "training"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>5-Stage Training</span>
                <span className={`text-[10px] font-normal ${activeMode === "training" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  Guided simulation
                </span>
              </button>
            </div>
          </div>

          {/* ── Mode content ──────────────────────────────────── */}
          {activeMode === "real" ? (
            <RealCoachMode commonConfig={commonConfig} />
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">What you'll learn in 5 stages</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {["How to respond when an offer is made", "How to anchor and justify your counter-offer", "How to handle pushback without losing leverage", "Phrases that hurt you — and phrases that win"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={handleStartTraining}
                disabled={loadingTraining}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-sm gap-2"
              >
                {loadingTraining ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Preparing Training...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Start 5-Stage Training</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
