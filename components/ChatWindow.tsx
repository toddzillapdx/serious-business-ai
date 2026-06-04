import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  onComplete?: (transcript: string) => void;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const SBAvatar = () => (
  <div style={{ width: '28px', height: '28px', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '-0.3px', flexShrink: 0 }}>
    SB
  </div>
);

export default function ChatWindow({ onComplete }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isInitial: true }),
        });
        const data = await response.json();
        setMessages([{ role: 'bot', content: data.reply, timestamp: nowTime() }]);
      } catch (error) {
        console.error('Chat init failed:', error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage, timestamp: nowTime() }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(0, -1)
        .filter((m) => m.content.trim())
        .map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const data = await response.json();
      const botReply = data.reply || data.message;
      if (!botReply) throw new Error('API response missing reply/message field');

      setMessages((prev) => [...prev, { role: 'bot', content: botReply, timestamp: nowTime() }]);

      if (data.isComplete) {
        setIsComplete(true);
        onComplete?.(updatedMessages.map((m) => `${m.role}: ${m.content}`).join('\n'));
      }
    } catch (error) {
      console.error('Message send failed:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, I had trouble processing that. Please try again.', timestamp: nowTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #0a0a0a', display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <style>{`
        @keyframes sbBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-4px); opacity: 1; } }
        @keyframes sbMsgAppear { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ background: '#0a0a0a', color: '#fff', padding: '16px 20px', borderBottom: '1px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '-0.5px' }}>SB</div>
          <div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>SeriousBot</div>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#999', marginTop: '2px' }}>CONTACT INTAKE · V1.0</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C853', boxShadow: '0 0 0 3px rgba(0,200,83,0.2)', display: 'inline-block' }} />
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f5f5f5' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', animation: 'sbMsgAppear 200ms ease forwards' }}>
            {msg.role === 'bot' ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <SBAvatar />
                <div style={{ maxWidth: '80%', padding: '14px 16px', fontSize: '14px', lineHeight: '1.55', background: '#fff', color: '#000', border: '1px solid #0a0a0a' }}>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '80%', padding: '14px 16px', fontSize: '14px', lineHeight: '1.55', background: '#0D6EFD', color: '#fff', alignSelf: 'flex-end' }}>
                {msg.content}
              </div>
            )}
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#999', marginTop: '4px', textTransform: 'uppercase', alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end', marginLeft: msg.role === 'bot' ? '38px' : 0 }}>
              {msg.role === 'bot' ? 'SERIOUSBOT' : 'YOU'} · {msg.timestamp}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <SBAvatar />
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '14px 16px', background: '#fff', border: '1px solid #0a0a0a' }}>
              <span style={{ width: '6px', height: '6px', background: '#999', borderRadius: '50%', display: 'inline-block', animation: 'sbBounce 1.2s infinite' }} />
              <span style={{ width: '6px', height: '6px', background: '#999', borderRadius: '50%', display: 'inline-block', animation: 'sbBounce 1.2s infinite 0.2s' }} />
              <span style={{ width: '6px', height: '6px', background: '#999', borderRadius: '50%', display: 'inline-block', animation: 'sbBounce 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}

        {isComplete && (
          <div style={{ textAlign: 'center', padding: '32px 0', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '12px', color: '#666', letterSpacing: '2px' }}>
            <div style={{ marginBottom: '12px' }}>— SESSION COMPLETE —</div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '3px', color: '#0a0a0a' }}>SERIOUS BUSINESS</div>
            <div style={{ marginTop: '8px', fontSize: '10px' }}>SERIOUSBUSINESS.AI</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div style={{ borderTop: '1px solid #0a0a0a', background: '#fff' }}>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              id="chat-input"
              name="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your reply…"
              disabled={loading}
              style={{ flex: 1, border: 'none', padding: '18px 20px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '14px', outline: 'none', background: 'transparent' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading ? '#555' : '#0D6EFD',
                color: '#fff',
                border: 'none',
                padding: '0 28px',
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 150ms ease, opacity 150ms ease',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              {loading ? '···' : 'Send →'}
            </button>
          </div>
          <div style={{ padding: '4px 20px 10px', fontSize: '10px', color: '#999', fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            Your conversation is confidential. Used only to understand your needs.
          </div>
        </div>
      )}
    </div>
  );
}
