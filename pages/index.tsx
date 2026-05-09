import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white text-[#0a0a0a]" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: '14px', lineHeight: '1.6' }}>

      {/* NAV */}
      <header className="flex items-center justify-between border-b border-[#ccc] bg-white px-4 md:px-8" style={{ height: '72px' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-black text-white" style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
          <div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#666', marginTop: '2px' }}>EST. 2026 — PORTLAND, OR</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8" style={{ listStyle: 'none' }}>
          <a href="#about" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>About</a>
          <a href="#caps" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Capabilities</a>
          <a href="#services" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Services</a>
          <a href="#manifesto" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Principles</a>
          <a href="/contact" style={{ fontSize: '13px', color: '#0a0a0a', textDecoration: 'none' }}>Contact</a>
        </nav>
        <a href="/contact" className="inline-flex items-center gap-2" style={{ background: '#000', color: '#fff', padding: '10px 18px', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase' }}>Let's Talk →</a>
      </header>

      {/* HERO */}
      <section className="px-4 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16 border-b border-[#ccc] max-w-[1280px] mx-auto">
        <h1
          className="text-[40px] sm:text-[64px] md:text-[88px] lg:text-[128px]"
          style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-3px', lineHeight: '0.95', marginBottom: '40px' }}
        >Digital transformation for businesses that actually need it<span style={{ color: '#3a3a3a' }}>.</span></h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:mt-12 items-end">
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#0a0a0a' }}>We help mid-sized businesses modernize how they operate — combining strategic advisory with hands-on build capability. Based in Portland. Built for the Pacific Northwest and beyond.</p>
          <div className="md:justify-self-end" style={{ border: '1px solid #0a0a0a', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', width: '100%', maxWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>STATUS</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>ACCEPTING WORK</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>REGION</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>PNW + REMOTE</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', letterSpacing: '2px', fontSize: '10px' }}><span>RESPONSE</span><strong style={{ color: '#0a0a0a', fontWeight: 700 }}>&lt; 48 HOURS</strong></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 md:px-8 py-16 md:py-20 border-b border-[#ccc] max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end border-b border-[#ccc] pb-8 mb-10 md:mb-12">
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>ABOUT US</div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>The Practice</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-12 items-start">
          <div style={{ borderLeft: '4px solid #0a0a0a', padding: '8px 0 8px 24px' }}>
            <p style={{ fontFamily: "var(--font-exo2), sans-serif", fontSize: '24px', letterSpacing: '-0.5px', lineHeight: '1.2', fontWeight: 900 }} className="md:text-[36px]">Serious Business is a digital transformation practice for mid-sized businesses and municipalities in the Pacific Northwest — enterprise-grade thinking without the enterprise price tag, or the enterprise bureaucracy.</p>
          </div>
          <aside style={{ border: '1px solid #0a0a0a', padding: '28px', background: '#fff' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#3a3a3a', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #0a0a0a' }}>Founder</div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#0a0a0a' }}>Todd Ames spent 25 years building digital products and leading innovation at Nike, adidas, and top creative agencies — from engineering through executive strategy. Serious Business brings that same capability to mid-sized businesses that deserve it but can&#39;t access it at enterprise scale.</p>
          </aside>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="caps" className="px-4 md:px-8 py-16 md:py-24 border-b border-[#ccc] max-w-[1280px] mx-auto" style={{ background: '#0a0a0a', color: '#fff' }}>
        <div className="flex justify-between items-end border-b border-[#3a3a3a] pb-8 mb-10 md:mb-12">
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>CAPABILITIES</div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>Four Disciplines</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#3a3a3a] overflow-hidden">
          {[
            { num: '01', icon: '/icons/ai_augmentation.png', title: 'AI Augmentation', desc: 'Practical AI that actually runs in your business — integrated into the tools your team already uses, measured by what it saves you, not what it can demo.' },
            { num: '02', icon: '/icons/operations_automation.png', title: 'Operations Automation', desc: 'Connecting your systems, eliminating manual work, and building workflows that run without you.' },
            { num: '03', icon: '/icons/consumer_experience.png', title: 'Consumer & Citizen Experience', desc: 'Modern web and mobile experiences that serve your customers or constituents the way they expect to be served.' },
            { num: '04', icon: '/icons/data_visibility.png', title: 'Data Visibility', desc: 'Real-time dashboards that turn your existing data into decisions your leadership can act on.' }
          ].map((cap, i) => (
            <div key={i} className="flex flex-col gap-6 p-8 md:p-10 border-b border-r border-[#3a3a3a]" style={{ minHeight: '260px', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
              <div className="flex justify-between items-start">
                <img src={cap.icon} alt={cap.title} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '2px', color: '#999' }}>CAP / {cap.num}</div>
              </div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', lineHeight: '1.15' }}>{cap.title}</div>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>{cap.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-4 md:px-8 py-16 md:py-24 border-b border-[#ccc] max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end border-b border-[#ccc] pb-8 mb-10 md:mb-12">
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>SERVICES</div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase' }}>Four Engagements</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#0a0a0a] overflow-hidden">
          {[
            { num: '01', title: 'Diagnose', desc: "A two-week audit of your systems, data, and operations. You'll leave with a clear picture of where you're losing time and money — and exactly what to do about it. We name the problems before we touch them." },
            { num: '02', title: 'Scope', desc: "A short, written plan with cost, sequencing, and the specific outcomes we'll be accountable for." },
            { num: '03', title: 'Build', desc: "Hands-on construction. We don't write recommendations and walk away — we ship the thing that works." },
            { num: '04', title: 'Operate', desc: 'Optional retainer for ongoing operations, observability, and AI augmentation as your needs evolve.' }
          ].map((step, i) => (
            <div key={i} className="flex flex-col p-6 border-b border-r border-[#0a0a0a]" style={{ position: 'relative', minHeight: '200px' }}>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '40px', letterSpacing: '-2px', lineHeight: '1', color: '#0a0a0a' }}>{step.num}</div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.3px', marginTop: '14px', textTransform: 'uppercase' }}>{step.title}</div>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.55', marginTop: '10px' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" className="px-4 md:px-8 py-20 md:py-32 border-t border-b border-[#0a0a0a] max-w-[1280px] mx-auto" style={{ background: '#0a0a0a', color: '#fff' }}>
        <div className="flex justify-between items-end border-b border-[#3a3a3a] pb-8 mb-10 md:mb-12">
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>PRINCIPLES</div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>The Manifesto</div>
        </div>

        <p
          className="text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] mb-12 md:mb-16"
          style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, letterSpacing: '-3px', lineHeight: '1.0' }}
        >Enterprise-grade<br />thinking. <span style={{ color: '#888' }}>Without<br />the enterprise<br />bureaucracy.</span></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-[#3a3a3a] pt-10 md:pt-12">
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
      <footer className="px-4 md:px-8 pt-10 pb-6 max-w-[1280px] mx-auto" style={{ background: '#0a0a0a', color: '#fff' }}>
        <div className="flex flex-wrap justify-between items-center gap-6 pb-8 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9" style={{ background: '#fff', color: '#0a0a0a', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
            <div>
              <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px' }}>SERIOUS BUSINESS</div>
              <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#999', marginTop: '2px' }}>SERIOUSBUSINESS.AI</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-6">
            <a href="/" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Home</a>
            <a href="#about" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>About</a>
            <a href="#caps" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Capabilities</a>
            <a href="#services" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Services</a>
            <a href="#manifesto" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Principles</a>
            <a href="/contact" style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ccc', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-5" style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', textTransform: 'uppercase' }}>
          <span>© 2026 Serious Business · Portland, OR</span>
          <span>Ship with Confidence.</span>
        </div>
      </footer>
    </div>
  );
}
