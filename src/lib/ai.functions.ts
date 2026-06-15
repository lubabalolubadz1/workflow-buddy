import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

async function runPrompt(system: string, prompt: string) {
  const gateway = getGateway();
  const { text } = await generateText({
    model: gateway(DEFAULT_MODEL),
    system,
    prompt,
  });
  return { text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipient: z.string().min(1).max(200),
      purpose: z.string().min(1).max(2000),
      tone: z.enum(["Formal", "Friendly", "Persuasive"]),
    }),
  )
  .handler(async ({ data }) => {
    const system = "You are a professional workplace communication expert.";
    const prompt = `Generate an email using:\n\nRecipient: ${data.recipient}\nPurpose: ${data.purpose}\nTone: ${data.tone}\n\nRequirements:\n- Professional language\n- Clear subject line\n- Proper greeting\n- Concise body\n- Professional closing\n\nReturn the email in plain text, starting with "Subject:" on the first line.`;
    return runPrompt(system, prompt);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(20000) }))
  .handler(async ({ data }) => {
    const system = "You are an expert meeting analyst.";
    const prompt = `Analyze the following meeting notes.\n\nProvide:\n\n1. Summary\n2. Key Decisions\n3. Action Items\n4. Deadlines\n\nUse clear markdown headings (## SUMMARY, ## KEY DECISIONS, ## ACTION ITEMS, ## DEADLINES).\n\nMeeting Notes:\n${data.notes}`;
    return runPrompt(system, prompt);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1).max(5000),
      priority: z.string().min(1).max(50),
      cadence: z.enum(["Daily", "Weekly"]),
    }),
  )
  .handler(async ({ data }) => {
    const system = "Act as a productivity coach.";
    const prompt = `Create a structured ${data.cadence.toLowerCase()} schedule based on:\n\nTasks:\n${data.tasks}\n\nPriority level: ${data.priority}\n\nRequirements:\n- Prioritize urgent tasks\n- Suggest time blocks (e.g. 08:00 - 09:00)\n- Avoid overload\n- Include short breaks\n- Use clear markdown formatting`;
    return runPrompt(system, prompt);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ topic: z.string().min(1).max(500) }))
  .handler(async ({ data }) => {
    const system = "Act as a research analyst.";
    const prompt = `Research Topic:\n${data.topic}\n\nProvide a structured report with markdown headings:\n\n## Overview\n## Key Insights\n## Opportunities\n## Recommendations\n## Conclusion`;
    return runPrompt(system, prompt);
  });
