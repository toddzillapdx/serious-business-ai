import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#fff', color: '#0a0a0a', fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '14px', lineHeight: '1.6' }}>
      {/* NAV */}
      <header style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ccc', background: '#fff', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
          <div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#666', marginTop: '2px' }}>EST. 2026 — PORTLAND, OR</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center', listStyle: 'none' }}>
          <a href="#about" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>About</a>
          <a href="#caps" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Capabilities</a>
          <a href="#services" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Services</a>
          <a href="#manifesto" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Principles</a>
          <a href="/contact" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Contact</a>
        </nav>
        <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#000', color: '#fff', padding: '10px 18px', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase' }}>Let's Talk →</a>
      </header>

      {/* HERO */}
      <section style={{ padding: '80px 32px 64px', borderBottom: '1px solid #ccc', maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '128px', letterSpacing: '-5px', lineHeight: '0.95', marginBottom: '48px' }}>Digital transformation for businesses that actually need it<span style={{ color: '#3a3a3a' }}>.</span></h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '48px', alignItems: 'end' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '60ch', color: '#0a0a0a' }}>We help mid-sized businesses modernize how they operate — combining strategic advisory with hands-on build capability. Based in Portland. Built for the Pacific Northwest and beyond.</p>
          <div style={{ border: '1px solid #0a0a0a', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', minWidth: '280px', justifySelf: 'end' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>STATUS</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>ACCEPTING WORK</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>REGION</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>PNW + REMOTE</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>RESPONSE</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>&lt; 48 HOURS</strong></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '80px 32px', borderBottom: '1px solid #ccc', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '32px', borderBottom: '1px solid #ccc', paddingBottom: '32px', marginBottom: '48px', alignItems: 'end' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>ABOUT US</div>
          <div></div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textAlign: 'right', textTransform: 'uppercase' }}>The Practice</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '48px', alignItems: 'start' }}>
          <div style={{ borderLeft: '4px solid #0a0a0a', padding: '8px 0 8px 32px' }}>
            <p style={{ fontFamily: "var(--font-exo2), sans-serif", fontSize: '36px', letterSpacing: '-1px', lineHeight: '1.2', fontWeight: 900 }}>Serious Business is a digital transformation practice for mid-sized businesses and municipalities in the Pacific Northwest — enterprise-grade thinking without the enterprise price tag, or the enterprise bureaucracy.</p>
          </div>
          <aside style={{ border: '1px solid #0a0a0a', padding: '32px', background: '#fff' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#3a3a3a', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #0a0a0a' }}>Founder</div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#0a0a0a' }}>Todd Ames spent 25 years building digital products and leading innovation at Nike, adidas, and top creative agencies — from engineering through executive strategy. Serious Business brings that same capability to mid-sized businesses that deserve it but can&#39;t access it at enterprise scale.</p>
          </aside>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="caps" style={{ padding: '96px 32px', borderBottom: '1px solid #ccc', background: '#0a0a0a', color: '#fff', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '32px', borderBottom: '1px solid #3a3a3a', paddingBottom: '32px', marginBottom: '48px', alignItems: 'end' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>CAPABILITIES</div>
          <div></div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textAlign: 'right', textTransform: 'uppercase' }}>Four Disciplines</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #3a3a3a' }}>
          {[
            { num: '01', title: 'AI Augmentation', desc: 'Practical AI that actually runs in your business — integrated into the tools your team already uses, measured by what it saves you, not what it can demo.' },
            { num: '02', title: 'Operations Automation', desc: 'Connecting your systems, eliminating manual work, and building workflows that run without you.' },
            { num: '03', title: 'Consumer & Citizen Experience', desc: 'Modern web and mobile experiences that serve your customers or constituents the way they expect to be served.' },
            { num: '04', title: 'Data Visibility', desc: 'Real-time dashboards that turn your existing data into decisions your leadership can act on.' }
          ].map((cap, i) => (
            <div key={i} style={{ padding: '40px', borderRight: i % 2 === 0 ? '1px solid #3a3a3a' : 'none', borderBottom: i < 2 ? '1px solid #3a3a3a' : 'none', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '320px', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '64px', height: '64px', border: '1px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◆</div>
                <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '2px', color: '#999' }}>CAP / {cap.num}</div>
              </div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '24px', letterSpacing: '-0.5px', lineHeight: '1.15' }}>{cap.title}</div>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>{cap.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES (Process) */}
      <section id="services" style={{ padding: '96px 32px', borderBottom: '1px solid #ccc', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '32px', borderBottom: '1px solid #ccc', paddingBottom: '32px', marginBottom: '48px', alignItems: 'end' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>SERVICES</div>
          <div></div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textAlign: 'right', textTransform: 'uppercase' }}>Four Engagements</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '1px solid #0a0a0a' }}>
          {[
            { num: '01', title: 'Diagnose', desc: "A two-week audit of your systems, data, and operations. You'll leave with a clear picture of where you're losing time and money — and exactly what to do about it. We name the problems before we touch them." },
            { num: '02', title: 'Scope', desc: 'A short, written plan with cost, sequencing, and the specific outcomes we\'ll be accountable for.' },
            { num: '03', title: 'Build', desc: 'Hands-on construction. We don\'t write recommendations and walk away — we ship the thing that works.' },
            { num: '04', title: 'Operate', desc: 'Optional retainer for ongoing operations, observability, and AI augmentation as your needs evolve.' }
          ].map((step, i) => (
            <div key={i} style={{ padding: '32px 24px', borderRight: i < 3 ? '1px solid #0a0a0a' : 'none', position: 'relative', minHeight: '240px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '48px', letterSpacing: '-2px', lineHeight: '1', color: '#0a0a0a' }}>{step.num}</div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '18px', letterSpacing: '-0.3px', marginTop: '16px', textTransform: 'uppercase' }}>{step.title}</div>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.55', marginTop: '12px' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" style={{ background: '#0a0a0a', color: '#fff', padding: '120px 32px', borderTop: '1px solid #0a0a0a', borderBottom: '1px solid #0a0a0a', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '32px', borderBottom: '1px solid #3a3a3a', paddingBottom: '32px', marginBottom: '48px', alignItems: 'end' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>PRINCIPLES</div>
          <div></div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textAlign: 'right', textTransform: 'uppercase' }}>The Manifesto</div>
        </div>

        <p style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '88px', letterSpacing: '-3px', lineHeight: '1.0', marginBottom: '64px' }}>Enterprise-grade<br />thinking. <span style={{ color: '#888' }}>Without<br />the enterprise<br />bureaucracy.</span></p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', borderTop: '1px solid #3a3a3a', paddingTop: '48px' }}>
          <div>
            <h4 style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', color: '#fff' }}>— Ship, Don't Slide</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#ccc' }}>Decks don't run in production. We deliver working systems on a clock — measured in weeks, not quarters. The work is the deliverable.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', color: '#fff' }}>— Practical Over Performative</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#ccc' }}>No AI theater. No buzzword bingo. Every tool we ship has to earn its keep against the operation it's meant to improve.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', color: '#fff' }}>— Accountable, Named</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#ccc' }}>You're hiring a practice, not a roster. The principal is on the project — start to finish — and answers the phone when something breaks.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0a', color: '#fff', padding: '48px 32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '32px', borderBottom: '1px solid #3a3a3a', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
            <div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
              <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#999', marginTop: '2px' }}>SERIOUSBUSINESS.AI</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="#home" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Home</a>
            <a href="#about" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>About</a>
            <a href="#caps" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Capabilities</a>
            <a href="#services" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Services</a>
            <a href="#manifesto" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Principles</a>
            <a href="/contact" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', fontSize: '11px', letterSpacing: '2px', color: '#888', textTransform: 'uppercase' }}>
          <span>© 2026 Serious Business · Portland, OR</span>
          <span>Ship with Confidence.</span>
        </div>
      </footer>
    </div>
  );
}
