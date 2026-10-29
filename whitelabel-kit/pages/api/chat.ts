import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { CLIENT_CONFIGS } from '../../config/clients';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Intake Bot <onboarding@resend.dev>';

const client = new Anthropic();
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting is optional: skipped entirely when Upstash env vars are not set.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Tune these for production
const MSG_LIMIT = 100;      // chat messages per IP per hour
const SUBMIT_LIMIT = 20;    // lead submissions per IP per day

async function checkLimit(key: string, limit: number, ttlSeconds: number): Promise<boolean> {
  if (!redis) return true;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, ttlSeconds);
    return count <= limit;
  } catch (err) {
    console.error('Rate limit check failed (Redis error), allowing request:', err);
    return true; // fail open so chat keeps working if Redis is down
  }
}

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

async function extractLead(transcript: string, hasPhone: boolean) {
  const extraction = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: 'Extract structured data from a bot intake transcript. Respond with ONLY valid JSON, no explanation.',
    messages: [
      {
        role: 'user',
        content: `Extract the following from this transcript and return as JSON with keys "name", "contact", "phone", and "summary":
- name: the visitor's full name
- contact: their email address (must be an email, not a phone number)
- phone: their phone number if provided, otherwise empty string
- summary: 1-2 sentences covering what they need, timeline, and budget if mentioned

Transcript:
${transcript}`,
      },
    ],
  });

  try {
    const raw = extraction.content[0].type === 'text' ? extraction.content[0].text : '{}';
    const text = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
    return JSON.parse(text);
  } catch {
    return { name: 'Unknown', contact: 'Not provided', phone: '', summary: 'See transcript below.' };
  }
}

function getIP(req: NextApiRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const ip = typeof fwd === 'string' ? fwd.split(',')[0].trim() : req.socket?.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const ip = getIP(req);
  const config = body.clientId && CLIENT_CONFIGS[body.clientId];
  if (!config) {
    res.status(400).json({ error: 'Unknown client' });
    return;
  }
  const rlPrefix = `intake:${body.clientId}`;

  // Step 2: visitor confirmed their details, send the lead email
  if (body.confirm === true) {
    const allowed = await checkLimit(`${rlPrefix}:submit:${ip}`, SUBMIT_LIMIT, 86400);
    if (!allowed) {
      res.status(200).json({
        confirmed: false,
        message: `You've already submitted a few times today. ${config.operatorName} will be in touch.`,
      });
      return;
    }

    const { name, email, summary, transcript } = body;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const conversationId = `lead-${Date.now()}`;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: Array.isArray(config.notificationEmail) ? config.notificationEmail : [config.notificationEmail],
        reply_to: typeof email === 'string' && email.includes('@') ? email : undefined,
        subject: `New Lead: ${String(name ?? '').slice(0, 80)} — ${date}`,
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #0a0a0a;">
            <div style="background: ${esc(config.branding?.primaryColor || '#111111')}; padding: 24px 32px;">
              <div style="color: #ffffff; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7;">${esc(config.businessName)}</div>
              <div style="color: #ffffff; font-size: 16px; font-weight: 700; letter-spacing: 0.05em;">NEW LEAD</div>
            </div>
            <div style="border: 1px solid #0a0a0a; border-top: none; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td colspan="2" style="padding: 8px 10px; background: ${esc(config.branding?.accentColor || '#333333')}; font-size: 10px; letter-spacing: 2px; color: #fff; text-transform: uppercase;">Lead Details</td></tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 11px; letter-spacing: 2px; color: #666; width: 120px;">NAME</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 700;">${esc(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 11px; letter-spacing: 2px; color: #666;">CONTACT</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${esc(email)}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 10px; font-size: 11px; letter-spacing: 2px; color: #666; vertical-align: top;">SUMMARY</td>
                  <td style="padding: 14px 0 10px; font-size: 14px; line-height: 1.6;">${esc(summary)}</td>
                </tr>
              </table>
            </div>
            <div style="font-size: 11px; letter-spacing: 2px; color: #666; margin-bottom: 8px;">FULL TRANSCRIPT</div>
            <pre style="background: #f5f5f5; border: 1px solid #eee; padding: 20px; font-size: 12px; line-height: 1.7; white-space: pre-wrap; margin: 0 0 24px;">${esc(transcript)}</pre>
            <div style="font-size: 11px; color: #999; letter-spacing: 1px;">${conversationId} · ${new Date().toISOString()}</div>
          </div>
        `,
      });
    } catch (err) {
      console.error('[chat] Lead email failed:', err);
      res.status(500).json({ confirmed: false, error: 'Failed to send lead' });
      return;
    }

    res.status(200).json({ confirmed: true });
    return;
  }

  if (body.isInitial) {
    res.status(200).json({ reply: config.greeting, message: config.greeting, isComplete: false });
    return;
  }

  const msgAllowed = await checkLimit(`${rlPrefix}:msg:${ip}`, MSG_LIMIT, 3600);
  if (!msgAllowed) {
    res.status(429).json({
      error: 'Too many messages.',
      message: "You've sent too many messages. Please try again in an hour.",
    });
    return;
  }

  try {
    // The page sends the full history as `messages` (roles: user | bot)
    const msgs = (Array.isArray(body.messages) ? body.messages : []).filter(
      (m: any) => m && typeof m.content === 'string' && m.content.trim() !== ''
    );
    const lastUser = [...msgs].reverse().find((m: any) => m.role === 'user');
    if (!lastUser) {
      res.status(400).json({ error: 'No user message found' });
      return;
    }

    let messages = msgs
      .map((m: any) => ({
        role: (m.role === 'bot' ? 'assistant' : m.role) as 'user' | 'assistant',
        content: String(m.content).slice(0, 500),
      }))
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .slice(-30);
    // Anthropic requires the first message to be from the user (drops the bot greeting)
    const firstUser = messages.findIndex((m: any) => m.role === 'user');
    messages = firstUser > 0 ? messages.slice(firstUser) : messages;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 150,
      system: config.systemPrompt(config.operatorName, config.followUpTimeframe),
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Sorry, I had trouble with that. Please try again.';

    const isComplete = config.closingPhrases.some((p: string) => assistantMessage.includes(p));

    if (isComplete) {
      const transcript = [
        ...messages.map((m: any) => `${m.role === 'user' ? 'Visitor' : config.botName}: ${m.content}`),
        `${config.botName}: ${assistantMessage}`,
      ].join('\n');

      let lead = { name: '', contact: '', phone: '', summary: '' };
      try {
        lead = await extractLead(transcript, !!config.collectPhone);
      } catch (err) {
        console.error('[chat] extractLead failed, returning isComplete anyway:', err);
      }

      res.status(200).json({
        reply: assistantMessage,
        message: assistantMessage,
        isComplete: true,
        capturedName: lead.name,
        capturedEmail: lead.contact,
        capturedPhone: lead.phone,
        transcript,
        summary: lead.summary,
      });
      return;
    }

    res.status(200).json({ reply: assistantMessage, message: assistantMessage, isComplete });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}
