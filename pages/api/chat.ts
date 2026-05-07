import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';

// Store conversations in memory (in production, use a database)
const conversations: Record<
  string,
  { messages: Array<{ role: 'user' | 'assistant'; content: string }>; exchangeCount: number }
> = {};

const client = new Anthropic();

console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);

const SYSTEM_PROMPT = `You are SeriousBot, a professional intake agent for Todd Ames's digital transformation consulting practice. You are curious, direct, and efficient. No fluff.

Your goal is to understand what the visitor is working on and gather key information:
1. What problem they're solving (their primary business challenge)
2. Current state (team size, tech stack, key blocker)
3. Timeline and budget (if they're willing to share)
4. Best way to follow up (email or phone)

Keep your responses short and conversational (1-3 sentences max). Ask one question at a time. Be genuine and curious, not robotic.

After 5-7 exchanges (when you have the key information), close the conversation with: "Got it. I'll pass this to Todd. He'll reach out within one business day."

Never offer to do things yourself—you're just an intake agent. No apologies, no canned responses. Be direct.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, conversationId, isInitial } = req.body;

  try {
    let convoId = conversationId;
    let conversationHistory = conversations[convoId];

    // Initialize if new conversation
    if (isInitial) {
      convoId = uuidv4();
      conversationHistory = {
        messages: [],
        exchangeCount: 0,
      };
      conversations[convoId] = conversationHistory;

      // Send opening message
      const openingMessage =
        "Hi there. I'm SeriousBot. What problem are you working on right now?";
      res.status(200).json({
        reply: openingMessage,
        conversationId: convoId,
        isComplete: false,
      });
      return;
    }

    // Add user message to history
    conversationHistory.messages.push({
      role: 'user',
      content: message,
    });
    conversationHistory.exchangeCount += 1;

    // Call Claude
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: conversationHistory.messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : 'Sorry, I had trouble with that. Please try again';

    // Add bot response to history
    conversationHistory.messages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Determine if conversation is complete
    const isComplete =
      conversationHistory.exchangeCount >= 5 &&
      (assistantMessage.includes("I'll pass this to Todd") ||
        assistantMessage.includes("He'll reach out within"));

    // If complete, trigger notification
    if (isComplete) {
      // Store transcript for notification
      const transcript = conversationHistory.messages
        .map((m) => `${m.role === 'user' ? 'Visitor' : 'SeriousBot'}: ${m.content}`)
        .join('\n');

      // Trigger email notification (fire and forget)
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convoId,
          transcript,
        }),
      }).catch(console.error);
    }

    res.status(200).json({
      reply: assistantMessage,
      conversationId: convoId,
      isComplete,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}
