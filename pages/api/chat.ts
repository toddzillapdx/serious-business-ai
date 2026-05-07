	import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are SeriousBot, a professional intake agent for Todd Ames's digital transformation consulting practice. You are curious, direct, and efficient. No fluff.

Your goal is to understand what the visitor is working on and gather key information:
1. What problem they're solving
2. Current state (team size, tech stack, key blocker)
3. Timeline and budget (if willing to share)
4. Best way to follow up (email or phone)

Keep responses short and conversational (1-3 sentences max). Ask one question at a time. Be genuine and curious, not robotic.

After 5-7 exchanges, close with: "Got it. I'll pass this to Todd. He'll reach out within one business day."

Never offer to do things yourself. No apologies, no canned responses. Be direct.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, history, isInitial } = req.body;

  try {
    if (isInitial) {
      res.status(200).json({
        reply: "Hi there. I'm SeriousBot. What problem are you working on right now?",
        isComplete: false,
      });
      return;
    }

    console.log('Body received:', JSON.stringify({ message, history }));
    const cleanHistory = (history || []).filter(
  (m: {role: string, content: string}) => m.role && m.content && m.content.trim() !== ''
);
const messages = [
  ...cleanHistory,
  { role: 'user' as const, content: String(message || '').trim() }
];

    
console.log('Messages being sent:', JSON.stringify(messages));

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Sorry, I had trouble with that. Please try again.';

    const isComplete =
      messages.length >= 10 &&
      (assistantMessage.includes("pass this to Todd") ||
        assistantMessage.includes("reach out within"));

    if (isComplete) {
      const transcript = messages
        .map((m: {role: string, content: string}) =>
          `${m.role === 'user' ? 'Visitor' : 'SeriousBot'}: ${m.content}`)
        .join('\n');

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      }).catch(console.error);
    }

    res.status(200).json({ reply: assistantMessage, isComplete });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}
