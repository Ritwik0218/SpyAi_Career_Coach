"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

const parseInlineStyles = (text) => {
  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
};

const convertMarkdownToHtml = (md) => {
  if (!md) return "";
  
  // Handle double newlines for paragraphs first
  const blocks = md.split(/\n\s*\n/);
  
  const parsedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    
    // 1. Headers: # Heading
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        return `<h${level} style="font-family: 'Times New Roman', Times, serif; font-weight: bold; margin-top: 1.2em; margin-bottom: 0.6em; line-height: 1.2; font-size: ${24 - level * 2}px;">${text}</h${level}>`;
      }
    }
    
    // 2. Lists: - item or * item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n[-*]\s+/).map(item => {
        let cleaned = item;
        if (cleaned.startsWith('- ') || cleaned.startsWith('* ')) {
          cleaned = cleaned.substring(2);
        }
        return `<li style="margin-bottom: 0.5em; line-height: 1.5; font-size: 15px;">${parseInlineStyles(cleaned)}</li>`;
      }).join('');
      return `<ul style="margin-bottom: 1.2em; padding-left: 20px; list-style-type: disc;">${items}</ul>`;
    }
    
    // 3. Paragraphs: convert single newlines to <br/> to preserve headers/address lines
    const formattedText = trimmed.split('\n').map(line => parseInlineStyles(line)).join('<br />');
    return `<p style="margin-bottom: 1.2em; line-height: 1.6; text-align: justify; font-size: 15px;">${formattedText}</p>`;
  });
  
  return parsedBlocks.filter(Boolean).join('');
};

const CoverLetterPreview = ({ content }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsPDF = async () => {
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
      
      tempDiv.innerHTML = `
        <div style="padding: 60px 80px; font-family: 'Times New Roman', Times, serif; color: #111111; max-width: 800px; margin: 0 auto; min-height: 1130px; box-sizing: border-box; background: white;">
          <div style="line-height: 1.6; white-space: normal;">
            ${convertMarkdownToHtml(content)}
          </div>
        </div>
      `;
      
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
            
            pdf.save("cover-letter.pdf");
            toast.success("Cover letter downloaded as PDF!");
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
    <div className="py-4 space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={downloadAsPDF}
          disabled={isDownloading || !content}
          className="gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting PDF...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Download as PDF
            </>
          )}
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden bg-background">
        <MDEditor value={content} preview="preview" height={700} />
      </div>
    </div>
  );
};

export default CoverLetterPreview;
