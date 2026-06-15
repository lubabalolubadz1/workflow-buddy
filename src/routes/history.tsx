import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadHistory, saveHistory, type HistoryEntry } from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "History — AI Workplace" }],
  }),
  component: HistoryPage,
});

const toolLabel: Record<HistoryEntry["tool"], string> = {
  email: "Email",
  meeting: "Meeting",
  tasks: "Tasks",
  research: "Research",
  chat: "Chat",
};

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return entries.filter(
      (e) =>
        !ql || e.title.toLowerCase().includes(ql) || e.output.toLowerCase().includes(ql),
    );
  }, [entries, q]);

  const remove = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveHistory(next);
  };

  return (
    <>
      <PageHeader title="History" description="Your previous AI requests" />
      <div className="space-y-4 px-4 py-6 sm:px-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history…"
            className="pl-9"
          />
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
            No history yet. Start using the AI tools and your requests will show up here.
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{toolLabel[e.tool]}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(e.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate font-medium">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.output}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/${e.tool === "chat" ? "chat" : e.tool}`}>Open tool</Link>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(e.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
