# AI Workplace Productivity Assistant — Build Plan

A professional SaaS-style dashboard with five AI tools powered by Lovable AI (Gemini default), a collapsible sidebar, dark mode, history, and export/copy actions.

## Stack notes (adapted to this project)
The spec lists React + Express + OpenAI/Gemini/Claude. This project is TanStack Start (React 19 + Vite) with Lovable AI Gateway as the backend boundary — no separate Express server needed and no third-party API keys to manage. All AI calls run through `createServerFn` handlers using `google/gemini-3-flash-preview` by default. Routing uses TanStack Router (file-based under `src/routes/`), not React Router.

## Routes (file-based)
```
src/routes/
  __root.tsx               (SidebarProvider shell + Outlet)
  index.tsx                (Dashboard — welcome + feature cards)
  email.tsx                (Smart Email Generator)
  meeting.tsx              (Meeting Notes Summarizer)
  tasks.tsx                (AI Task Planner)
  research.tsx             (AI Research Assistant)
  chat.tsx                 (AI Chatbot)
  settings.tsx             (Theme toggle, clear history)
  history.tsx              (Past AI requests, searchable)
```

Each tool route has its own `head()` with unique title/description and renders the Responsible AI notice at the bottom.

## Components
- `AppSidebar` — shadcn Sidebar with nav items + icons (Home, Mail, FileText, ListChecks, Search, MessageSquare, Clock, Settings), collapsible to icon strip, active-route highlighting.
- `Header` — SidebarTrigger + page title + dark mode toggle.
- `DashboardCard` — glassmorphism card linking to each tool.
- `AIOutput` — formatted output area with Copy and (where relevant) Export buttons.
- `ResponsibleAINotice` — shared footer component on every AI page.
- `ChatMessage` / `ChatComposer` — for chatbot, rendered with `react-markdown`.

## AI integration
- `src/lib/ai-gateway.server.ts` — Lovable AI Gateway provider helper.
- `src/lib/ai.functions.ts` — one `createServerFn` per feature:
  - `generateEmail({ recipient, purpose, tone })`
  - `summarizeMeeting({ notes })`
  - `planTasks({ tasks, priority, cadence })`
  - `researchTopic({ topic })`
  - `chat({ messages })` — streams via `/api/chat` route using `streamText` + `useChat` (AI SDK) for live responses.
- One-shot tools use `generateText` with model `google/gemini-3-flash-preview`. System prompts match the spec verbatim.
- Errors (402/429) surfaced inline with friendly toast.

## History (local-first)
Stored in `localStorage` (no auth requested). Each AI call appends `{ id, tool, input, output, timestamp }`. History page lists, filters, and lets the user reopen or delete entries. Settings has "Clear all history".

## Export / Copy
- Copy button on every output via `navigator.clipboard.writeText`.
- "Download as PDF" for email/research/meeting summary using `jspdf` (client-side, lightweight).
- "Export as .txt/.md" for task plans and meeting summaries.

## Design system
Tailwind v4 tokens defined in `src/styles.css` using oklch:
- Primary `#2563EB`, secondary `#1E293B`, background `#F8FAFC`, success `#10B981`, text `#334155`.
- Glassmorphism utility (`backdrop-blur`, translucent surfaces), `rounded-2xl`, `shadow-lg hover:shadow-xl`, smooth transitions.
- Dark mode via `.dark` class toggle persisted in localStorage.
- Inter (or similar professional sans) loaded via `<link>` in `__root.tsx`.

## Responsive behavior
- Desktop: sidebar + main grid (`lg:grid-cols-3` for dashboard cards).
- Tablet: sidebar collapses to icon strip.
- Mobile: hamburger SidebarTrigger, single column.

## Responsible AI
`ResponsibleAINotice` shown on all five tool pages and chat, exactly as spec text.

## Out of scope (will not build unless asked)
- Auth / user accounts
- Server-side history persistence (Lovable Cloud)
- Real third-party OpenAI/Claude keys (Lovable AI Gateway covers all calls)

## Open questions
1. Confirm Lovable AI Gateway (Gemini default) is fine instead of bringing your own OpenAI/Claude keys.
2. History in `localStorage` only — or do you want it persisted in a database (would enable Lovable Cloud)?
3. Any brand/logo or app name to show in the sidebar header, or just "AI Workplace"?

Reply with answers (or "go ahead with defaults") and I'll implement.