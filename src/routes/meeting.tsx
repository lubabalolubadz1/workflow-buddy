import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { ResponsibleAINotice } from "@/components/ResponsibleAINotice";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Turn meeting notes into clear summaries and action items." },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { text } = await run({ data: { notes } });
      setOutput(text);
      addHistory({
        tool: "meeting",
        title: `Meeting summary (${new Date().toLocaleDateString()})`,
        input: notes,
        output: text,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Extract summaries, decisions, action items, and deadlines"
      />
      <div className="grid gap-6 px-4 py-6 sm:px-8 lg:grid-cols-2">
        <form onSubmit={submit} className="rounded-2xl border bg-card p-6 shadow-lg">
          <Label htmlFor="notes" className="mb-3 block">
            Paste or dictate meeting notes
          </Label>
          <VoiceRecorder
            onTranscript={(text) =>
              setNotes((prev) => (prev ? `${prev.trimEnd()} ${text}` : text))
            }
          />
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your raw meeting notes here, or use the mic above to dictate..."
            rows={14}
            required
            maxLength={20000}
            className="mt-3"
          />
          <Button type="submit" disabled={loading} className="mt-4 w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {loading ? "Summarizing..." : "Summarize Notes"}
          </Button>
        </form>
        <div>
          {output ? (
            <AIOutput content={output} filename="meeting-summary.txt" pdf />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Your summary will appear here.
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-8 sm:px-8">
        <ResponsibleAINotice />
      </div>
    </>
  );
}
