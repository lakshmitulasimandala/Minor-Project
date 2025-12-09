"use client";

import jsPDF from "jspdf";
import { useState } from "react";

interface ReportSubmittedProps {
  data: any;
  onComplete?: (data: any) => void;
}

export function ReportSubmitted({ data }: ReportSubmittedProps) {
  // Safe access with defaults
  const reportId = data?.reportId || "ERROR-ID-NOT-FOUND";
  const incidentType = data?.type || data?.specificType || "N/A";
  const specificType = data?.specificType || "N/A";
  const title = data?.title || "Untitled report";
  const description = data?.description || "No description provided.";
  const location = data?.location || "N/A";
  const createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
  const imageBase64 = data?.image || null;

  const [generating, setGenerating] = useState(false);

  const generatePdf = async () => {
    setGenerating(true);
    try {
      // Create jsPDF doc (A4)
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const margin = 40;
      let cursorY = margin;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(title, margin, cursorY);
      cursorY += 30;

      // Meta row: Report ID + Submitted On (right aligned)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Report ID: ${reportId}`, margin, cursorY);
      const submittedStr = `Submitted: ${createdAt.toLocaleString()}`;
      // right align submitted date
      const pageWidth = doc.internal.pageSize.getWidth();
      const submittedWidth = doc.getTextWidth(submittedStr);
      doc.text(submittedStr, pageWidth - margin - submittedWidth, cursorY);
      cursorY += 22;

      // Incident types / Location
      doc.setFont("helvetica", "bold");
      doc.text("Incident Type:", margin, cursorY);
      doc.setFont("helvetica", "normal");
      doc.text(`${incidentType} — ${specificType}`, margin + 100, cursorY);
      cursorY += 18;

      doc.setFont("helvetica", "bold");
      doc.text("Location:", margin, cursorY);
      doc.setFont("helvetica", "normal");
      // wrap location text to fit width
      const textAreaWidth = pageWidth - margin * 2 - 100;
      const locLines = doc.splitTextToSize(location, textAreaWidth);
      doc.text(locLines, margin + 100, cursorY);
      cursorY += locLines.length * 14 + 6;

      // Add Image (if present)
      if (imageBase64) {
        try {
          // compute available width, keep some margins
          const availableW = pageWidth - margin * 2;
          const imageMaxW = Math.min(availableW, 420);
          const imageX = margin;
          const imageY = cursorY + 6;

          // We try to keep a decent height; if image is large it will be scaled
          const imageH = 140;

          // imageBase64 may include data:mime; pass it directly
          doc.addImage(imageBase64, "JPEG", imageX, imageY, imageMaxW, imageH);
          cursorY = imageY + imageH + 12;
        } catch (imgErr) {
          // fallback: ignore image if addImage fails
          console.warn("Could not add image to PDF:", imgErr);
        }
      }

      // Description
      doc.setFont("helvetica", "bold");
      doc.text("Description:", margin, cursorY);
      cursorY += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      const descWidth = pageWidth - margin * 2;
      const descLines = doc.splitTextToSize(description, descWidth);
      doc.text(descLines, margin, cursorY);
      cursorY += descLines.length * 14 + 12;

      // Footer / generated on
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const footer = `Generated on ${new Date().toLocaleString()}`;
      const footerWidth = doc.getTextWidth(footer);
      doc.text(footer, pageWidth - margin - footerWidth, doc.internal.pageSize.getHeight() - margin / 2);

      // Save file
      doc.save(`${reportId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center">
        <div className="bg-green-500/10 rounded-full p-3">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-medium text-white">Report Successfully Submitted</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Your report has been securely transmitted to law enforcement
        </p>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="text-white font-medium mb-2">Your Report ID</h4>
        <div className="bg-zinc-900 rounded p-3">
          <code className="text-sky-400">{reportId}</code>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Save this ID to check your report status or communicate securely with law enforcement
        </p>
      </div>

      <div className="pt-4 flex gap-3 justify-center">
        <button
          onClick={generatePdf}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-60"
        >
          {generating ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
