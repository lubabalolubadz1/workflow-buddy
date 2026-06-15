import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  content: string;
  filename?: string;
  pdf?: boolean;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export function AIOutput({ content, filename = "output.txt", pdf, editable, onChange }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const lines = doc.splitTextToSize(content, 500);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lines, 40, 60);
    doc.save(filename.replace(/\.[^.]+$/, "") + ".pdf");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">AI Output</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={downloadTxt}>
            <Download className="mr-1 h-3.5 w-3.5" />
            .txt
          </Button>
          {pdf && (
            <Button size="sm" variant="outline" onClick={downloadPdf}>
              <Download className="mr-1 h-3.5 w-3.5" />
              PDF
            </Button>
          )}
        </div>
      </div>
      {editable ? (
        <textarea
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-[280px] w-full resize-y rounded-xl border border-input bg-background p-3 font-mono text-sm leading-relaxed"
        />
      ) : (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
