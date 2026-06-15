import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      { name: "description", content: "Your AI-powered productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const cards = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails in seconds with the right tone and structure.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into summaries, decisions, action items, and deadlines.",
    href: "/meeting",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    description: "Generate a balanced daily or weekly schedule with smart time blocks.",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefings with insights, opportunities, and recommendations.",
    href: "/research",
    icon: Search,
  },
  {
    title: "AI Chatbot",
    description: "Ask the workplace assistant anything — productivity, scheduling, comms.",
    href: "/chat",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back — pick a tool to get started" />
      <div className="px-4 py-6 sm:px-8 sm:py-10">
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg">
          <div className="absolute inset-0 gradient-primary opacity-90" />
          <div className="relative z-10 text-primary-foreground">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Lovable AI
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Work smarter with your AI productivity suite
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
              Generate emails, summarize meetings, plan your day, and research topics — all in one
              professional workspace.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className="group glass-card rounded-2xl p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Open
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
