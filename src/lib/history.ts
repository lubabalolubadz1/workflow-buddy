export type ToolKey = "email" | "meeting" | "tasks" | "research" | "chat";

export interface HistoryEntry {
  id: string;
  tool: ToolKey;
  title: string;
  input: string;
  output: string;
  timestamp: number;
}

const KEY = "ai-workplace-history";

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 100)));
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "timestamp">) {
  const all = loadHistory();
  const full: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  saveHistory([full, ...all]);
  return full;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
