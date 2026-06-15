import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { PageHeader } from "@/components/PageHeader";
import { ResponsibleAINotice } from "@/components/ResponsibleAINotice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace" },
      { name: "description", content: "Chat with your AI Workplace Productivity Assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Save completed conversations to history
  const lastSavedRef = useRef(0);
  useEffect(() => {
    if (status !== "ready" || messages.length === lastSavedRef.current || messages.length < 2) return;
    lastSavedRef.current = messages.length;
    const last = messages[messages.length - 1];
    const prev = messages[messages.length - 2];
    if (last?.role !== "assistant" || prev?.role !== "user") return;
    const userText = partsToText(prev.parts);
    const aiText = partsToText(last.parts);
    addHistory({
      tool: "chat",
      title: userText.slice(0, 60),
      input: userText,
      output: aiText,
    });
  }, [messages, status]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <>
      <PageHeader title="AI Workplace Assistant" description="Ask anything about productivity, comms, or scheduling" />
      <div className="flex min-h-[calc(100vh-65px)] flex-col px-4 py-6 sm:px-8">
        <div
          ref={scrollerRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-2xl border bg-card p-4 shadow-lg"
        >
          {messages.length === 0 && (
            <div className="grid h-full place-items-center py-16 text-center text-sm text-muted-foreground">
              <div>
                <Bot className="mx-auto mb-2 h-8 w-8 text-primary" />
                Try: "How can I improve team productivity?"
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1">
                  <ReactMarkdown>{partsToText(m.parts)}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
        </div>
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Ask your AI assistant…"
            rows={2}
            className="flex-1 resize-none"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="lg">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <ResponsibleAINotice />
      </div>
    </>
  );
}

function partsToText(parts: ReadonlyArray<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}
