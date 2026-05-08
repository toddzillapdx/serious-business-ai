import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { conversationId, transcript, userEmail } = req.body;

  if (!transcript) {
    res.status(400).json({ error: 'Missing transcript' });
    return;
  }

  const id = conversationId || `sb-${Date.now()}`;

  try {
    const toddEmail = process.env.TODD_EMAIL || 'todd@seriousbusiness.ai';

    // Send to Todd
    await resend.emails.send({
      from: 'SeriousBot <bot@seriousbusiness.ai>',
      to: toddEmail,
      subject: `New SeriousBot Conversation — ${id}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
          <h2>New SeriousBot Conversation</h2>
          <p><strong>Conversation ID:</strong> ${id}</p>
          ${userEmail ? `<p><strong>User Email:</strong> ${userEmail}</p>` : ''}
          
          <hr />
          
          <pre style="background: #f5f5f5; padding: 16px; overflow-x: auto; white-space: pre-wrap;">
${transcript}
          </pre>
          
          <hr />
          <p style="font-size: 12px; color: #888;">
            SeriousBot — Auto-generated. Reply directly to continue the conversation or call the user.
          </p>
        </div>
      `,
    });

    // Send auto-reply to user if email provided
    if (userEmail) {
      await resend.emails.send({
        from: 'SeriousBot <bot@seriousbusiness.ai>',
        to: userEmail,
        subject: 'Thanks for chatting with SeriousBot',
        html: `
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
            <p>Thanks for chatting with SeriousBot.</p>
            <p>Todd will be in touch within one business day.</p>
            <hr />
            <p style="text-align: center; font-weight: bold;">SERIOUS BUSINESS</p>
            <p style="text-align: center; font-size: 12px; color: #888;">SERIOUSBUSINESS.AI</p>
          </div>
        `,
      });
    }

    res.status(200).json({ success: true, conversationId: id });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
