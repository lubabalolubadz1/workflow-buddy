import { ShieldAlert } from "lucide-react";

export function ResponsibleAINotice() {
  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
      <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
        <ShieldAlert className="h-4 w-4" />
        Responsible AI Notice
      </div>
      <p>
        AI-generated content may contain inaccuracies or incomplete information. Users should review and
        verify all outputs before making business decisions. This application is intended to assist
        productivity and not replace human judgment.
      </p>
    </div>
  );
}
