import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import defaultConfig from '../../config';
import seriousbusiness from '../../config/clients/seriousbusiness';
import ottomanempire from '../../config/clients/ottomanempire';

const CLIENT_CONFIGS: Record<string, any> = {
  seriousbusiness,
  ottomanempire,
};

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


async function buildEmailSummary(transcript: string): Promise<{ name: string; contact: string; phone: string; summary: string }> {
  const extraction = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: "Extract structured data from a bot intake transcript. Respond with ONLY valid JSON, no explanation.",
    messages: [{
      role: "user",
      content: `Extract the following from this transcript and return as JSON with keys "name", "contact", "phone", and "summary":
- name: the visitor's full name
- contact: their email address (must be an email, not a phone number)
- phone: their phone number if provided, otherwise empty string
- summary: 1-2 sentences covering what they need, timeline, and budget if mentioned

Transcript:
${transcript}`,
    }],
  });

  try {
    const raw = extraction.content[0].type === "text" ? extraction.content[0].text : "{}";
    const text = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    return JSON.parse(text);
  } catch {
    return { name: "Unknown", contact: "Not provided", phone: "", summary: "See transcript below." };
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
  const ip = getIP(req);
  const config = (body.clientId && CLIENT_CONFIGS[body.clientId]) || defaultConfig;

  console.log("[chat] incoming body keys:", Object.keys(body), "| confirm:", body.confirm, typeof body.confirm, "| clientId:", body.clientId);

  // Handle confirmation: user verified their name/email, now send the email
  if (body.confirm === true) {
    // TODO: reset to 10 and 3 before production deploy
    const convAllowed = await checkLimit(`sb:conv:${ip}`, 20, 86400);
    if (!convAllowed) {
      res.status(200).json({ confirmed: false, message: "You've already submitted a few times today. Todd will be in touch." });
      return;
    }

    const { name, email, summary, transcript } = body;
    const conversationId = `sb-${Date.now()}`;
    const toddEmail = config.notificationEmail;

    try {
      console.log("[chat] Sending confirmation email", {
        to: config.notificationEmail,
        from: `${config.botName} <bot@seriousbusiness.ai>`,
        subject: `New Lead: ${name} — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      });
      const sendResult = await resend.emails.send({
        from: `${config.botName} <bot@seriousbusiness.ai>`,
        to: toddEmail,
        subject: `New Lead: ${name} — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #0a0a0a;">
            <div style="background: #0a0a0a; color: #fff; padding: 20px 24px; margin-bottom: 0;">
              <div style="font-size: 11px; letter-spacing: 3px; color: #999; margin-bottom: 4px;">${config.businessName.toUpperCase()} · ${config.botName.toUpperCase()}</div>
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
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${email}</td>
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
      console.log("[chat] Confirmation email sent:", sendResult);
    } catch (err) {
      console.error("[chat] Confirmation email failed:", JSON.stringify(err, null, 2), err);
    }

    res.status(200).json({ confirmed: true });
    return;
  }

  const isInitial = body.isInitial;

  if (isInitial) {
    res.status(200).json({
      reply: config.greeting,
      message: config.greeting,
      isComplete: false,
    });
    return;
  }

  // TODO: reset to 10 and 3 before production deploy
  const msgAllowed = await checkLimit(`sb:msg:${ip}`, 100, 3600);
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
      system: config.systemPrompt(config.operatorName, config.followUpTimeframe),
      messages,
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, I had trouble with that. Please try again.";

    const isComplete = config.closingPhrases.some(phrase => assistantMessage.includes(phrase));

    console.log("[chat] assistantMessage:", assistantMessage);
    console.log("[chat] isComplete:", isComplete);

    if (isComplete) {
      const transcript = [
        ...messages.map((m: any) => `${m.role === "user" ? "Visitor" : config.botName}: ${m.content}`),
        `${config.botName}: ${assistantMessage}`,
      ].join("\n");

      let name = "";
      let contact = "";
      let phone = "";
      let summary = "";
      try {
        const extracted = await buildEmailSummary(transcript);
        name = extracted.name;
        contact = extracted.contact;
        phone = extracted.phone;
        summary = extracted.summary;
        console.log("[chat] Extracted for confirmation:", { name, contact, phone });
      } catch (err) {
        console.error("[chat] buildEmailSummary failed, returning isComplete anyway:", err);
      }

      res.status(200).json({
        reply: assistantMessage,
        message: assistantMessage,
        isComplete: true,
        capturedName: name,
        capturedEmail: contact,
        capturedPhone: phone,
        transcript,
        summary,
      });
      return;
    }

    res.status(200).json({ reply: assistantMessage, message: assistantMessage, isComplete });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
}
// Fri May  8 03:53:06 PM UTC 2026
