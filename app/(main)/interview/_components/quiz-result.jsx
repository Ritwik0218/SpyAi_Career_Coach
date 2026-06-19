"use client";

import React, { useState } from "react";
import { Trophy, CheckCircle2, XCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const renderScorecardHTML = (result) => {
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const questionsList = result.questions.map((q, idx) => {
    const statusColor = q.isCorrect ? "#10b981" : "#ef4444";
    const statusText = q.isCorrect ? "Correct" : "Incorrect";

    return `
      <div style="margin-bottom: 25px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
          <h4 style="margin: 0; font-size: 15px; font-weight: 600; color: #1f2937; line-height: 1.4;">
            Question ${idx + 1}: ${q.question}
          </h4>
          <span style="font-size: 11px; font-weight: bold; color: ${statusColor}; background-color: ${q.isCorrect ? "#ecfdf5" : "#fef2f2"}; padding: 3px 6px; border-radius: 4px; border: 1px solid ${q.isCorrect ? "#a7f3d0" : "#fecaca"}; white-space: nowrap;">
            ${statusText}
          </span>
        </div>
        <div style="font-size: 13px; color: #4b5563; margin-bottom: 8px; padding-left: 5px;">
          <p style="margin: 4px 0;"><strong>Your Answer:</strong> ${q.userAnswer}</p>
          ${!q.isCorrect ? `<p style="margin: 4px 0;"><strong>Correct Answer:</strong> ${q.answer}</p>` : ""}
        </div>
        <div style="font-size: 12px; color: #374151; background-color: #f9fafb; padding: 10px; border-radius: 6px; border-left: 3px solid #6b7280; line-height: 1.5;">
          <strong style="color: #111827;">Explanation:</strong> ${q.explanation}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="padding: 40px 50px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; max-width: 800px; margin: 0 auto; box-sizing: border-box; background: white; min-height: 1130px;">
      <!-- Report Header -->
      <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.025em;">SPY AI CAREER COACH</h1>
          <p style="margin: 3px 0 0 0; font-size: 13px; color: #6b7280;">Mock Interview Performance Report</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 12px; color: #4b5563;"><strong>Date:</strong> ${dateStr}</p>
        </div>
      </div>

      <!-- Scorecard Section -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 10px; padding: 20px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
        <div style="flex: 1;">
          <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #1e3a8a;">Overall Performance Score</h2>
          <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.4;">
            This scorecard captures your performance results, highlighting strengths and immediate areas for preparation.
          </p>
        </div>
        <div style="text-align: center; background: white; padding: 12px 20px; border-radius: 8px; border: 1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <div style="font-size: 32px; font-weight: 800; color: #2563eb; line-height: 1;">${result.quizScore.toFixed(0)}%</div>
          <div style="font-size: 11px; font-weight: 600; color: #4b5563; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Score</div>
        </div>
      </div>

      <!-- AI Feedback & Tips -->
      ${result.improvementTip ? `
        <div style="background-color: #faf5ff; border: 1px solid #f3e8ff; border-left: 4px solid #a855f7; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #6b21a8;">
            💡 Feedback & Actionable Recommendations
          </h3>
          <p style="margin: 0; font-size: 13px; color: #581c87; line-height: 1.5;">
            ${result.improvementTip}
          </p>
        </div>
      ` : ""}

      <!-- Detailed Question Breakdown -->
      <div>
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: 700; color: #111827; border-bottom: 1px solid #d1d5db; padding-bottom: 6px;">
          Detailed Question Review
        </h3>
        ${questionsList}
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #9ca3af;">
        Report generated by SPY AI Career Coach. Keep learning and practicing to ace your next interview!
      </div>
    </div>
  `;
};

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!result) return null;

  const downloadScorecardAsPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.style.background = "white";
      tempDiv.style.boxSizing = "border-box";

      tempDiv.innerHTML = renderScorecardHTML(result);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(tempDiv);

      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imgData = reader.result;
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            pdf.save("interview-scorecard.pdf");
            toast.success("Scorecard downloaded successfully!");
            resolve();
          };
          reader.readAsDataURL(blob);
        }, "image/png");
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="flex items-center gap-2 text-3xl gradient-title">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Quiz Results
        </h1>
        <Button
          variant="outline"
          onClick={downloadScorecardAsPDF}
          disabled={isDownloading}
          className="gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Scorecard
            </>
          )}
        </Button>
      </div>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {result.questions.map((q, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
