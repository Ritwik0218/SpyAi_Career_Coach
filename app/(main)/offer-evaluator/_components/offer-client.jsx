"use client";

import { useState } from "react";
import { evaluateOffer } from "@/actions/offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Calculator, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OfferClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    baseSalary: 0,
    signOnBonus: 0,
    equity: 0,
    vestingYears: 4,
    targetBonus: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for UX while typing, fallback to 0 in math
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "role" ? value : (value === "" ? "" : Number(value))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.baseSalary) {
      toast.error("Please provide at least a Role and Base Salary.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      // Ensure empty numeric fields default to 0
      const cleanData = {
        ...formData,
        baseSalary: Number(formData.baseSalary) || 0,
        signOnBonus: Number(formData.signOnBonus) || 0,
        equity: Number(formData.equity) || 0,
        vestingYears: Number(formData.vestingYears) || 4,
        targetBonus: Number(formData.targetBonus) || 0,
      };

      const data = await evaluateOffer(cleanData);
      setResult(data);
      toast.success("Offer evaluated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to evaluate offer");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.assessment) return;
    navigator.clipboard.writeText(result.assessment);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Tooltip for the chart
  const formatCurrency = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Offer & Equity Evaluator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Break down your total compensation, visualize vesting schedules, and generate an AI negotiation script.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Offer Details</CardTitle>
              <CardDescription>Input your compensation package details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title / Level</Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="e.g. L4 Software Engineer"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseSalary">Base Salary (USD)</Label>
                  <Input
                    id="baseSalary"
                    name="baseSalary"
                    type="number"
                    value={formData.baseSalary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signOnBonus">Sign-On Bonus (USD)</Label>
                  <Input
                    id="signOnBonus"
                    name="signOnBonus"
                    type="number"
                    value={formData.signOnBonus}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equity">Total Equity / RSU Grant (USD)</Label>
                  <Input
                    id="equity"
                    name="equity"
                    type="number"
                    value={formData.equity}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vestingYears">Vesting Years</Label>
                    <Input
                      id="vestingYears"
                      name="vestingYears"
                      type="number"
                      value={formData.vestingYears}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetBonus">Target Bonus %</Label>
                    <Input
                      id="targetBonus"
                      name="targetBonus"
                      type="number"
                      value={formData.targetBonus}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Total Comp
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results & Chart */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !loading && (
             <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 text-center min-h-[400px]">
               <Calculator className="h-16 w-16 mb-4 opacity-50" />
               <p>Enter your offer details to visualize your compensation over 4 years.</p>
             </Card>
          )}

          {loading && (
             <Card className="h-full flex flex-col items-center justify-center p-12 min-h-[400px]">
               <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
               <p className="text-muted-foreground">Crunching the numbers and drafting your script...</p>
             </Card>
          )}

          {result && !loading && (
            <>
              {/* Chart Card */}
              <Card>
                <CardHeader>
                  <CardTitle>4-Year Compensation Projection</CardTitle>
                  <CardDescription>Visualizing base, bonus, and equity vesting over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis 
                        tickFormatter={(value) => \`\$\${value / 1000}k\`} 
                        className="text-xs" 
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                      />
                      <Legend />
                      <Bar dataKey="base" stackId="a" fill="hsl(var(--primary))" name="Base Salary" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="bonus" stackId="a" fill="#10b981" name="Bonus (Sign-on/Target)" />
                      <Bar dataKey="equity" stackId="a" fill="#8b5cf6" name="Equity (Vesting)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Assessment & Script Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>AI Negotiation Strategy</CardTitle>
                    <CardDescription>Professional feedback and an email template to negotiate your offer.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy Script"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary p-4 bg-muted/30 rounded-lg">
                    <ReactMarkdown>{result.assessment}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
