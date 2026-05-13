import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hi there. I'm SeriousBot. Tell me what's not working — or what you're trying to build. Todd will follow up personally.",
      timestamp: '09:42'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [capturedName, setCapturedName] = useState('');
  const [capturedEmail, setCapturedEmail] = useState('');
  const [pendingTranscript, setPendingTranscript] = useState('');
  const [pendingSummary, setPendingSummary] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles',
      hour12: true,
    });
    setSessionTime(time);
    setMessages(prev => [{ ...prev[0], timestamp: time }, ...prev.slice(1)]);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: input }])
        })
      });

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      if (data.isComplete) {
        setIsComplete(true);
        setCapturedName(data.capturedName || '');
        setCapturedEmail(data.capturedEmail || '');
        setPendingTranscript(data.transcript || '');
        setPendingSummary(data.summary || '');
        setEditName(data.capturedName || '');
        setEditEmail(data.capturedEmail || '');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const finalName = editMode ? editName : capturedName;
    const finalEmail = editMode ? editEmail : capturedEmail;
    setConfirmLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirm: true,
          name: finalName,
          email: finalEmail,
          summary: pendingSummary,
          transcript: pendingTranscript,
        })
      });
      setCapturedName(finalName);
      setCapturedEmail(finalEmail);
      setIsConfirmed(true);
    } catch (error) {
      console.error('Error confirming:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#0a0a0a', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '14px', lineHeight: '1.6' }}>
      {/* NAV */}
      <header className="flex items-center justify-between px-4 md:px-8" style={{ height: '72px', borderBottom: '1px solid #ccc', background: '#fff' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
          <div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#666', marginTop: '2px' }}>EST. 2026 — PORTLAND, OR</div>
          </div>
        </Link>
        <nav className="hidden md:flex" style={{ gap: '32px', alignItems: 'center', listStyle: 'none' }}>
          <a href="/#about" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>About</a>
          <a href="/#caps" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Capabilities</a>
          <a href="/#services" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Services</a>
          <a href="/#manifesto" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Principles</a>
          <a href="/contact" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none', borderBottom: '2px solid #000', paddingBottom: '6px' }}>Contact</a>
        </nav>
        <a href="#contact" className="hidden md:inline-flex" style={{ alignItems: 'center', gap: '10px', background: '#000', color: '#fff', padding: '10px 18px', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase' }}>{"Let's Talk →"}</a>
      </header>

      {/* CONTACT SECTION */}
      <section className="px-4 md:px-8 py-16 md:py-24" style={{ borderBottom: '1px solid #ccc', maxWidth: '1280px', margin: '0 auto' }} id="contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column */}
          <div>
            <h2 className="text-[56px] sm:text-[72px] md:text-[88px]" style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-3px', lineHeight: '0.95', marginBottom: '32px' }}>{"Let's"}<br />{"talk."}</h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', fontSize: '16px', lineHeight: '1.4' }}>
                <span style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '18px', color: '#0a0a0a', minWidth: '24px' }}>—</span>
                <div>
                  <strong style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-0.3px', display: 'block', fontSize: '16px', textTransform: 'uppercase' }}>No sales pitch.</strong>
                  <span style={{ display: 'block', fontSize: '13px', color: '#666', marginTop: '2px' }}>No funnel, no follow-up sequences.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', fontSize: '16px', lineHeight: '1.4' }}>
                <span style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '18px', color: '#0a0a0a', minWidth: '24px' }}>—</span>
                <div>
                  <strong style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-0.3px', display: 'block', fontSize: '16px', textTransform: 'uppercase' }}>No commitment.</strong>
                  <span style={{ display: 'block', fontSize: '13px', color: '#666', marginTop: '2px' }}>A conversation, not a contract.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', fontSize: '16px', lineHeight: '1.4' }}>
                <span style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '18px', color: '#0a0a0a', minWidth: '24px' }}>—</span>
                <div>
                  <strong style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-0.3px', display: 'block', fontSize: '16px', textTransform: 'uppercase' }}>Just a real conversation.</strong>
                  <span style={{ display: 'block', fontSize: '13px', color: '#666', marginTop: '2px' }}>{"Tell SeriousBot what you're working on. Todd follows up personally within 48 hours."}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Chat Window */}
          <div style={{ border: '1px solid #0a0a0a', background: '#fff', display: 'flex', flexDirection: 'column', height: '560px' }}>
            {/* Chat Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #0a0a0a', background: '#0a0a0a', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.5px' }}>SB</div>
                <div>
                  <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>SeriousBot</div>
                  <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#999', marginTop: '2px' }}>CONTACT INTAKE · V1.0</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C853', boxShadow: '0 0 0 3px rgba(0,200,83,0.2)', display: 'inline-block' }}></span>Online
              </div>
            </div>

            {/* Chat Body */}
            <div ref={chatBodyRef} style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f5f5f5', overflowY: 'auto' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#666', textAlign: 'center', padding: '4px 0' }}>{sessionTime ? `— SESSION STARTED · ${sessionTime} PT —` : '— SESSION STARTED —'}</div>

              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    lineHeight: '1.55',
                    background: msg.role === 'bot' ? '#fff' : '#0a0a0a',
                    color: msg.role === 'bot' ? '#000' : '#fff',
                    border: `1px solid ${msg.role === 'bot' ? '#0a0a0a' : '#0a0a0a'}`,
                    alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end'
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#666', marginTop: '6px', textTransform: 'uppercase', alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end' }}>
                    {msg.role === 'bot' ? 'SERIOUSBOT' : 'YOU'} · {msg.timestamp}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
                  <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#666', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
                  <style>{`@keyframes bounce { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }`}</style>
                </div>
              )}
            </div>

            {/* Chat Input / Confirmation / Done */}
            {!isComplete ? (
            <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #0a0a0a', background: '#fff' }}>
              <input
                type="text"
                placeholder="Type your reply…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '18px 20px',
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: '14px',
                  outline: 'none',
                  background: 'transparent'
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  background: '#0a0a0a',
                  color: '#fff',
                  border: 'none',
                  padding: '0 28px',
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Send →
              </button>
            </div>
            ) : isConfirmed ? (
              <div style={{ borderTop: '1px solid #0a0a0a', padding: '16px 20px', background: '#fff', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '11px', letterSpacing: '2px', color: '#666', textAlign: 'center' }}>
                SENT — TODD WILL REACH OUT TO {capturedEmail.toUpperCase()}
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #0a0a0a', background: '#fff', padding: '16px 20px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#666', marginBottom: '10px', fontFamily: "var(--font-ibm-plex-mono), monospace" }}>CONFIRM YOUR DETAILS BEFORE SENDING</div>
                {editMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Full name"
                      style={{ border: '1px solid #ccc', padding: '8px 10px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '13px', outline: 'none', width: '100%' }}
                    />
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email address"
                      style={{ border: '1px solid #ccc', padding: '8px 10px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '13px', outline: 'none', width: '100%' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <button
                        onClick={() => { setCapturedName(editName); setCapturedEmail(editEmail); setEditMode(false); }}
                        style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '8px 16px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
                      >Save</button>
                      <button
                        onClick={() => setEditMode(false)}
                        style={{ background: 'transparent', color: '#666', border: '1px solid #ccc', padding: '8px 16px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
                      >Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '4px', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#999', minWidth: '44px', fontFamily: "var(--font-ibm-plex-mono), monospace" }}>NAME</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: "var(--font-ibm-plex-mono), monospace" }}>{capturedName || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#999', minWidth: '44px', fontFamily: "var(--font-ibm-plex-mono), monospace" }}>EMAIL</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: "var(--font-ibm-plex-mono), monospace" }}>{capturedEmail || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={handleConfirm}
                        disabled={confirmLoading || editMode}
                        style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: confirmLoading ? 'not-allowed' : 'pointer', opacity: confirmLoading ? 0.6 : 1 }}
                      >{confirmLoading ? 'Sending…' : 'Looks good →'}</button>
                      <button
                        onClick={() => { setEditName(capturedName); setEditEmail(capturedEmail); setEditMode(true); }}
                        style={{ background: 'transparent', color: '#666', border: 'none', padding: '10px 0', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'underline' }}
                      >Edit</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-4 md:px-8" style={{ background: '#0a0a0a', color: '#fff', paddingTop: '48px', paddingBottom: '24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8" style={{ paddingBottom: '32px', borderBottom: '1px solid #3a3a3a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
            <div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
              <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#999', marginTop: '2px' }}>SERIOUSBUSINESS.AI</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 md:gap-8">
            <a href="/" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Home</a>
            <a href="/#about" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>About</a>
            <a href="/#caps" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Capabilities</a>
            <a href="/#services" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Services</a>
            <a href="/#manifesto" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Principles</a>
            <a href="/contact" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2" style={{ paddingTop: '20px', fontSize: '11px', letterSpacing: '2px', color: '#888', textTransform: 'uppercase' }}>
          <span>© 2026 Serious Business · Portland, OR</span>
          <span>Ship with Confidence.</span>
        </div>
      </footer>
    </div>
  );
}
