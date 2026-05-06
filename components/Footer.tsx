import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-3 items-center gap-8">
          {/* Left: Logo */}
          <div>
            <div className="text-sm font-exo font-black">
              [SB]
            </div>
          </div>

          {/* Center: Domain */}
          <div className="text-center">
            <p className="font-mono text-xs tracking-widest">
              SERIOUSBUSINESS.AI
            </p>
          </div>

          {/* Right: CTA */}
          <div className="text-right">
            <Link href="/contact" className="font-mono text-sm tracking-wider hover:opacity-60 transition">
              Let's Talk →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
