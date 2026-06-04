import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
  { label: 'About',        anchor: '#about' },
  { label: 'Capabilities', anchor: '#caps' },
  { label: 'Services',     anchor: '#services' },
  { label: 'Principles',   anchor: '#manifesto' },
  { label: 'Contact',      href: '/contact' },
];

export default function Nav() {
  const router = useRouter();
  const isContact = router.pathname === '/contact';
  const isHome = router.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .sb-nav-link {
          font-size: 13px;
          text-decoration: none;
          color: #ccc;
          padding-bottom: 4px;
          border-bottom: 1px solid transparent;
          transition: color 150ms ease;
        }
        .sb-nav-link:hover { color: #0D6EFD; }
        .sb-nav-link.active {
          color: #0D6EFD;
          border-bottom-color: #0D6EFD;
        }
        .sb-mobile-link {
          font-family: var(--font-exo2), sans-serif;
          font-weight: 900;
          font-size: 36px;
          letter-spacing: 4px;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          transition: color 150ms ease;
        }
        .sb-mobile-link:hover, .sb-mobile-link.active { color: #0D6EFD; }
      `}</style>

      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8"
        style={{
          height: '72px',
          background: '#0a0a0a',
          color: '#fff',
          borderBottom: scrolled ? '1px solid #2a2a2a' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: '#fff', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '-0.5px' }}>SB</div>
          <div>
            <div style={{ fontFamily: "var(--font-exo2), sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px', color: '#fff' }}>SERIOUS BUSINESS</div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#999', marginTop: '2px' }}>EST. 2026 — PORTLAND, OR</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(link => {
            const href = link.href ?? (isHome ? link.anchor! : `/${link.anchor}`);
            const active = link.href === '/contact' && isContact;
            return (
              <a key={link.label} href={href} className={`sb-nav-link${active ? ' active' : ''}`}>
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2"
            style={{
              background: '#0D6EFD',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            {"Let's Talk →"}
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff' }} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0a0a0a',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'sbFadeIn 150ms ease forwards',
          }}
        >
          <style>{`@keyframes sbFadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '28px',
              cursor: 'pointer',
              fontFamily: "var(--font-exo2), sans-serif",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
            {LINKS.map(link => {
              const href = link.href ?? (isHome ? link.anchor! : `/${link.anchor}`);
              const active = link.href === '/contact' && isContact;
              return (
                <a
                  key={link.label}
                  href={href}
                  onClick={close}
                  className={`sb-mobile-link${active ? ' active' : ''}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <Link
            href="/contact"
            onClick={close}
            style={{
              marginTop: '48px',
              background: '#0D6EFD',
              color: '#fff',
              padding: '14px 36px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '3px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            {"Let's Talk →"}
          </Link>
        </div>
      )}
    </>
  );
}
