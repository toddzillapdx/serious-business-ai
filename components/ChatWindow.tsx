import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatWindowProps {
  onComplete?: (transcript: string) => void;
}

export default function ChatWindow({ onComplete }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
        setMessages([{ role: 'bot', content: data.reply }]);
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
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages
  .slice(0, -1)
  .filter((m) => m.content && m.content.trim() !== '')
  .map((m) => ({
    role: m.role === 'bot' ? 'assistant' : 'user',
    content: m.content,
  }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);

      if (data.isComplete) {
        setIsComplete(true);
        if (onComplete) {
          const transcript = updatedMessages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n');
          onComplete(transcript);
        }
      }
    } catch (error) {
      console.error('Message send failed:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, I had trouble processing that. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-black flex flex-col h-full">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-black">
        <div className="font-exo font-black text-sm">[SB]</div>
        <div className="font-mono text-xs tracking-widest">SERIOUSBOT</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-xs">ONLINE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'bot' ? (
              <div className="bg-black text-white px-4 py-3 max-w-xs font-mono text-sm leading-relaxed">
                {message.content}
              </div>
            ) : (
              <div className="bg-white text-black border border-black px-4 py-3 max-w-xs font-mono text-sm leading-relaxed">
                {message.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-1 text-black font-mono text-sm">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
          </div>
        )}

        {isComplete && (
          <div className="space-y-4 text-center font-mono text-sm py-8">
            <p className="text-sb-gray">Todd will be in touch within one business day.</p>
            <div className="space-y-2">
              <p className="text-black">————————————————</p>
              <p className="font-exo font-black text-lg tracking-widest">SERIOUS BUSINESS</p>
              <p className="text-black">————————————————</p>
              <p className="text-xs tracking-widest">SERIOUSBUSINESS.AI</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isComplete && (
        <div className="bg-white border-t border-black p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your reply..."
            disabled={loading}
            className="flex-1 border border-black px-4 py-3 font-mono text-sm focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-black text-white px-6 py-3 font-exo font-black hover:opacity-80 disabled:opacity-50 transition"
          >
            SEND →
          </button>
        </div>
      )}
    </div>
  );
}
