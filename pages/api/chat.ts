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

  const body = req.body;
  const isInitial = body.isInitial;

  if (isInitial) {
    res.status(200).json({
      reply: "Hi there. I am SeriousBot. What problem are you working on right now?",
      isComplete: false,
    });
    return;
  }

  try {
    // Support both payload formats:
    // New: { message: string, history: Message[] }
    // Old: { messages: { role: "bot"|"user", content: string }[] }
    let userContent: string;
    let cleanHistory: { role: "user" | "assistant"; content: string }[];

    if (typeof body.message === "string" && body.message.trim()) {
      userContent = body.message.trim();
      const rawHistory = Array.isArray(body.history)
        ? body.history.filter((m: any) => m && typeof m.content === "string" && m.content.trim() !== "" && (m.role === "user" || m.role === "assistant"))
        : [];
      const firstUserIdx = rawHistory.findIndex((m: any) => m.role === "user");
      cleanHistory = firstUserIdx > 0 ? rawHistory.slice(firstUserIdx) : rawHistory;
    } else if (Array.isArray(body.messages) && body.messages.length >= 1) {
      const msgs = body.messages.filter((m: any) => m && typeof m.content === "string" && m.content.trim() !== "");
      const lastUserMsg = [...msgs].reverse().find((m: any) => m.role === "user");
      if (!lastUserMsg) {
        res.status(400).json({ error: "No user message found" });
        return;
      }
      userContent = lastUserMsg.content.trim();
      const lastUserIdx = msgs.lastIndexOf(lastUserMsg);
      const rawHistory = msgs
        .slice(0, lastUserIdx)
        .map((m: any) => ({
          role: (m.role === "bot" ? "assistant" : m.role) as "user" | "assistant",
          content: m.content as string,
        }))
        .filter((m) => m.role === "user" || m.role === "assistant");
      const firstUser = rawHistory.findIndex((m) => m.role === "user");
      cleanHistory = firstUser > 0 ? rawHistory.slice(firstUser) : rawHistory;
    } else {
      res.status(400).json({ error: "Message required" });
      return;
    }

    const messages = [
      ...cleanHistory,
      { role: "user" as const, content: userContent }
    ];

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
