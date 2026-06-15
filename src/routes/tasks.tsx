import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { ResponsibleAINotice } from "@/components/ResponsibleAINotice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Generate balanced daily or weekly schedules." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [cadence, setCadence] = useState<"Daily" | "Weekly">("Daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { text } = await run({ data: { tasks, priority, cadence } });
      setOutput(text);
      addHistory({
        tool: "tasks",
        title: `${cadence} plan`,
        input: tasks,
        output: text,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="AI Task Planner" description="Smart time blocks built around your priorities" />
      <div className="grid gap-6 px-4 py-6 sm:px-8 lg:grid-cols-2">
        <form onSubmit={submit} className="rounded-2xl border bg-card p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Review client emails\nFinalize Q3 proposal\nTeam stand-up\nPrepare presentation slides"}
                rows={10}
                required
                maxLength={5000}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cadence">Plan type</Label>
                <Select value={cadence} onValueChange={(v) => setCadence(v as typeof cadence)}>
                  <SelectTrigger id="cadence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Planning..." : "Generate Plan"}
            </Button>
          </div>
        </form>
        <div>
          {output ? (
            <AIOutput content={output} filename="task-plan.txt" />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Your schedule will appear here.
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
