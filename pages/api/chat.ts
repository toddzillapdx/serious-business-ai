import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const client = new Anthropic();
const resend = new Resend(process.env.RESEND_API_KEY);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function checkLimit(key: string, limit: number, ttlSeconds: number): Promise<boolean> {
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, ttlSeconds);
    return count <= limit;
  } catch (err) {
    console.error("Rate limit check failed (Redis error), allowing request:", err);
    return true; // fail open — don't block chat if Redis is unavailable
  }
}

const SYSTEM_PROMPT = `You are SeriousBot, a professional intake agent for Todd Ames digital transformation consulting practice. You are curious, direct, and efficient. No fluff.

Your goal is to understand what the visitor is working on and gather the following — in this order:
1. What problem they are solving
2. Current state (team size, tech stack, key blocker)
3. Timeline and budget (if willing to share)
4. Their full name — ask directly: "What's your full name?"
5. Their email address — ask directly: "And your email?" (email is required, not optional)

Keep responses short and conversational (1-3 sentences max). Ask one question at a time. Be genuine and curious, not robotic.

REQUIRED: You must have the visitor's full name AND email address before closing. Do not accept a phone number in place of email. If they try to end without providing both, ask for the missing item before wrapping up.

Once you have the problem, name, and email, close with exactly: "Got it. I'll pass this to Todd. He'll reach out within one business day."

Never offer to do things yourself. No apologies, no canned responses. Be direct.`;

async function buildEmailSummary(transcript: string): Promise<{ name: string; contact: string; summary: string }> {
  const extraction = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: "Extract structured data from a SeriousBot intake transcript. Respond with ONLY valid JSON, no explanation.",
    messages: [{
      role: "user",
      content: `Extract the following from this transcript and return as JSON with keys "name", "contact", and "summary":
- name: the visitor's full name (look for answers to "What's your full name?")
- contact: their email address (look for answers to "And your email?" — must be an email, not a phone)
- summary: 1-2 sentences covering the problem they're solving, timeline, and budget if mentioned

Transcript:
${transcript}`,
    }],
  });

  try {
    const raw = extraction.content[0].type === "text" ? extraction.content[0].text : "{}";
    const text = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    return JSON.parse(text);
  } catch {
    return { name: "Unknown", contact: "Not provided", summary: "See transcript below." };
  }
}

function getIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const isInitial = body.isInitial;

  if (isInitial) {
    res.status(200).json({
      reply: "Hi there. I'm SeriousBot. Tell me what's not working — or what you're trying to build. Todd will follow up personally.",
      message: "Hi there. I'm SeriousBot. Tell me what's not working — or what you're trying to build. Todd will follow up personally.",
      isComplete: false,
    });
    return;
  }

  // Rate limit: 10 messages per IP per hour
  const ip = getIP(req);
  const msgAllowed = await checkLimit(`sb:msg:${ip}`, 10, 3600);
  if (!msgAllowed) {
    res.status(429).json({ error: "Too many messages. Please try again later.", message: "You've sent too many messages. Please try again in an hour." });
    return;
  }

  try {
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
      assistantMessage.includes("pass this to Todd") ||
      assistantMessage.includes("reach out within one business day") ||
      assistantMessage.includes("pass your information to Todd") ||
      assistantMessage.includes("pass this along to Todd") ||
      assistantMessage.includes("get this to Todd") ||
      assistantMessage.includes("I'll let Todd know") ||
      assistantMessage.includes("within one business day");

    console.log("[chat] assistantMessage:", assistantMessage);
    console.log("[chat] isComplete:", isComplete);

    if (isComplete) {
      // Rate limit: 3 completed conversations per IP per 24 hours
      const convAllowed = await checkLimit(`sb:conv:${ip}`, 3, 86400);
      if (!convAllowed) {
        res.status(200).json({
          reply: "It looks like you've already submitted a few times today. Todd will be in touch from your earlier conversation.",
          message: "It looks like you've already submitted a few times today. Todd will be in touch from your earlier conversation.",
          isComplete: false,
        });
        return;
      }

      const transcript = messages
        .map((m: any) => `${m.role === "user" ? "Visitor" : "SeriousBot"}: ${m.content}`)
        .join("\n");

      const conversationId = `sb-${Date.now()}`;
      const toddEmail = process.env.TODD_EMAIL || "todd@seriousbusiness.ai";

      console.log("[chat] Sending email, transcript length:", transcript.length);
      try {
        const { name, contact, summary } = await buildEmailSummary(transcript);
        console.log("[chat] Email summary extracted:", { name, contact });
        await resend.emails.send({
          from: "SeriousBot <bot@seriousbusiness.ai>",
          to: toddEmail,
          subject: `New Lead: ${name} — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          html: `
            <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #0a0a0a;">
              <div style="background: #0a0a0a; color: #fff; padding: 20px 24px; margin-bottom: 0;">
                <div style="font-size: 11px; letter-spacing: 3px; color: #999; margin-bottom: 4px;">SERIOUSBOT INTAKE</div>
                <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">New Lead</div>
              </div>
              <div style="border: 1px solid #0a0a0a; border-top: none; padding: 24px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 11px; letter-spacing: 2px; color: #666; width: 120px;">NAME</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 700;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 11px; letter-spacing: 2px; color: #666;">CONTACT</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${contact}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; color: #666; vertical-align: top; padding-top: 14px;">SUMMARY</td>
                    <td style="padding: 10px 0; font-size: 14px; line-height: 1.6; padding-top: 14px;">${summary}</td>
                  </tr>
                </table>
              </div>
              <div style="font-size: 11px; letter-spacing: 2px; color: #666; margin-bottom: 8px;">FULL TRANSCRIPT</div>
              <pre style="background: #f5f5f5; border: 1px solid #eee; padding: 20px; font-size: 12px; line-height: 1.7; white-space: pre-wrap; margin: 0 0 24px;">${transcript}</pre>
              <div style="font-size: 11px; color: #999; letter-spacing: 1px;">${conversationId} · ${new Date().toISOString()}</div>
            </div>
          `,
        });
        console.log("[chat] Email sent successfully to", toddEmail);
      } catch (err) {
        console.error("[chat] Email send failed:", err);
      }
    }

    res.status(200).json({ reply: assistantMessage, message: assistantMessage, isComplete });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
}
// Fri May  8 03:53:06 PM UTC 2026
