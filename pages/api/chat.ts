import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are SeriousBot, a professional intake agent for Todd Ames digital transformation consulting practice. You are curious, direct, and efficient. No fluff.

Your goal is to understand what the visitor is working on and gather key information:
1. What problem they are solving
2. Current state (team size, tech stack, key blocker)
3. Timeline and budget (if willing to share)
4. Best way to follow up (email or phone)

Keep responses short and conversational (1-3 sentences max). Ask one question at a time. Be genuine and curious, not robotic.

After 5-7 exchanges, close with: "Got it. I will pass this to Todd. He will reach out within one business day."

Never offer to do things yourself. No apologies, no canned responses. Be direct.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, history, isInitial } = req.body;
  console.log("[chat] req.body:", JSON.stringify(req.body));

  if (isInitial) {
    res.status(200).json({
      reply: "Hi there. I am SeriousBot. What problem are you working on right now?",
      isComplete: false,
    });
    return;
  }

  try {
    const rawHistory = Array.isArray(history)
      ? history.filter((m: any) => m && typeof m.content === "string" && m.content.trim() !== "" && (m.role === "user" || m.role === "assistant"))
      : [];

    // Anthropic requires messages to start with a user turn; drop any leading assistant messages
    const firstUserIdx = rawHistory.findIndex((m: any) => m.role === "user");
    const cleanHistory = firstUserIdx > 0 ? rawHistory.slice(firstUserIdx) : rawHistory;

    const userContent = typeof message === "string" ? message.trim() : "";

    if (!userContent) {
      res.status(400).json({ error: "Message required" });
      return;
    }

    const messages = [
      ...cleanHistory,
      { role: "user" as const, content: userContent }
    ];

    console.log("Sending to Claude:", JSON.stringify(messages));

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, I had trouble with that. Please try again.";

    const isComplete =
      messages.length >= 10 &&
      (assistantMessage.includes("pass this to Todd") ||
        assistantMessage.includes("reach out within"));

    if (isComplete) {
      const transcript = messages
        .map((m: any) => `${m.role === "user" ? "Visitor" : "SeriousBot"}: ${m.content}`)
        .join("\n");

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      }).catch(console.error);
    }

    res.status(200).json({ reply: assistantMessage, isComplete });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
}
// cache bust Thu May  7 03:06:21 PM UTC 2026
