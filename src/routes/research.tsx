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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { researchTopic } from "@/lib/ai.functions";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Get structured research briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { text } = await run({ data: { topic } });
      setOutput(text);
      addHistory({
        tool: "research",
        title: topic,
        input: topic,
        output: text,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to research topic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="AI Research Assistant" description="Structured briefings with insights and recommendations" />
      <div className="space-y-6 px-4 py-6 sm:px-8">
        <form onSubmit={submit} className="rounded-2xl border bg-card p-6 shadow-lg">
          <Label htmlFor="topic">Research topic (type or dictate)</Label>
          <VoiceRecorder
            onTranscript={(text) =>
              setTopic((prev) => (prev ? prev + " " + text : text))
            }
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI adoption in mid-market HR teams"
              required
              maxLength={500}
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="sm:w-44">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Researching..." : "Research"}
            </Button>
          </div>
        </form>
        {output ? (
          <AIOutput content={output} filename="research.txt" pdf />
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            Your research briefing will appear here.
          </div>
        )}
        <ResponsibleAINotice />
      </div>
    </>
  );
}
