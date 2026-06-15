import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { clearHistory } from "@/lib/history";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — AI Workplace" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="space-y-4 px-4 py-6 sm:px-8 max-w-2xl">
        <section className="rounded-2xl border bg-card p-6 shadow-lg">
          <h2 className="font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Switch between light and dark mode.</p>
          <div className="mt-3 flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">Toggle theme</span>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-lg">
          <h2 className="font-semibold">History</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your AI requests are stored locally in your browser.
          </p>
          <Button
            variant="destructive"
            className="mt-3"
            onClick={() => {
              clearHistory();
              toast.success("History cleared");
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all history
          </Button>
        </section>
      </div>
    </>
  );
}
