import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface ClientConfig {
  botName: string;
  businessName: string;
  operatorName: string;
  notificationEmail: string;
  followUpTimeframe: string;
  greeting: string;
  collectPhone: boolean;
  closingPhrases: string[];
  systemPrompt: (operatorName: string, followUpTimeframe: string) => string;
}

const CLIENT_LOADERS: Record<string, () => Promise<{ default: ClientConfig }>> = {
  seriousbusiness: () => import('../config/clients/seriousbusiness'),
  ottomanempire: () => import('../config/clients/ottomanempire'),
  offthehook: () => import('../config/clients/offthehook'),
};

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export default function Chat() {
  const router = useRouter();
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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
  const [capturedPhone, setCapturedPhone] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [clientId, setClientId] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const client = router.query.client;
    if (!client || typeof client !== 'string' || !CLIENT_LOADERS[client]) {
      setNotFound(true);
      return;
    }
    CLIENT_LOADERS[client]()
      .then(mod => {
        const cfg = mod.default;
        const time = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Los_Angeles',
          hour12: true,
        });
        setSessionTime(time);
        setMessages([{ id: '1', role: 'bot', content: cfg.greeting, timestamp: time }]);
        setClientId(client);
        setConfig(cfg);
      })
      .catch(() => setNotFound(true));
  }, [router.isReady, router.query.client]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !config) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          messages: messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: input }]),
        }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
      if (data.isComplete) {
        const name = data.capturedName || '';
        const email = data.capturedEmail || '';
        const phone = data.capturedPhone || '';
        const invalidName = !name || name === 'Unknown';
        const invalidEmail = !email || email === 'Not provided';
        setCapturedName(name);
        setCapturedEmail(email);
        setCapturedPhone(phone);
        setPendingTranscript(data.transcript || '');
        setPendingSummary(data.summary || '');
        setEditName(name);
        setEditEmail(email);
        setEditPhone(phone);
        if (invalidName || invalidEmail) setEditMode(true);
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const finalName = capturedName;
    const finalEmail = capturedEmail;
    setConfirmLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirm: true,
          clientId,
          name: finalName,
          email: finalEmail,
          summary: pendingSummary,
          transcript: pendingTranscript,
        }),
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

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'monospace', fontSize: '14px', color: '#666' }}>
        Not found
      </div>
    );
  }

  if (!config) return null;

  return (
    <>
      <Head>
        <title>{config.botName} — {config.businessName}</title>
      </Head>
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '14px', lineHeight: '1.6', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ border: '1px solid #0a0a0a', background: '#fff', display: 'flex', flexDirection: 'column', height: '560px' }}>
            {/* Chat Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #0a0a0a', background: '#0a0a0a', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.5px' }}>SB</div>
                <div>
                  <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>{config.botName}</div>
                  <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#999', marginTop: '2px' }}>CONTACT INTAKE · V1.0</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C853', boxShadow: '0 0 0 3px rgba(0,200,83,0.2)', display: 'inline-block' }}></span>Online
              </div>
            </div>

            {/* Chat Body */}
            <div ref={chatBodyRef} style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f5f5f5', overflowY: 'auto' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#666', textAlign: 'center', padding: '4px 0' }}>
                {sessionTime ? `— SESSION STARTED · ${sessionTime} PT —` : '— SESSION STARTED —'}
              </div>

              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    lineHeight: '1.55',
                    background: msg.role === 'bot' ? '#fff' : '#0a0a0a',
                    color: msg.role === 'bot' ? '#000' : '#fff',
                    border: '1px solid #0a0a0a',
                    alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#666', marginTop: '6px', textTransform: 'uppercase', alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end' }}>
                    {msg.role === 'bot' ? config.botName.toUpperCase() : 'YOU'} · {msg.timestamp}
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
              <div style={{ display: 'flex', borderTop: '1px solid #0a0a0a', background: '#fff' }}>
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
                    background: 'transparent',
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
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  Send →
                </button>
              </div>
            ) : isConfirmed ? (
              <div style={{ borderTop: '1px solid #0a0a0a', padding: '16px 20px', background: '#fff', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '11px', letterSpacing: '2px', color: '#666', textAlign: 'center' }}>
                SENT — {config.operatorName.toUpperCase()} WILL REACH OUT TO {capturedEmail.toUpperCase()}
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
                    {config.collectPhone && (
                      <input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Phone number"
                        style={{ border: '1px solid #ccc', padding: '8px 10px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '13px', outline: 'none', width: '100%' }}
                      />
                    )}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <button
                        onClick={() => { setCapturedName(editName); setCapturedEmail(editEmail); if (config.collectPhone) setCapturedPhone(editPhone); setEditMode(false); }}
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
                    {config.collectPhone && (
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#999', minWidth: '44px', fontFamily: "var(--font-ibm-plex-mono), monospace" }}>PHONE</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: "var(--font-ibm-plex-mono), monospace" }}>{capturedPhone || '—'}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={handleConfirm}
                        disabled={confirmLoading || editMode}
                        style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: "var(--font-ibm-plex-mono), monospace", fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: confirmLoading ? 'not-allowed' : 'pointer', opacity: confirmLoading ? 0.6 : 1 }}
                      >{confirmLoading ? 'Sending…' : 'Looks good →'}</button>
                      <button
                        onClick={() => { setEditName(capturedName); setEditEmail(capturedEmail); setEditPhone(capturedPhone); setEditMode(true); }}
                        style={{ background: 'transparent', color: '#666', border: 'none', padding: '10px 0', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'underline' }}
                      >Edit</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
