import Link from 'next/link';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="bg-black text-white h-screen flex flex-col justify-between p-8">
      {/* Logo at top */}
      <Logo variant="icon" color="white" className="text-base font-exo font-black" />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="font-exo font-black text-5xl mb-8 tracking-tighter leading-tight">
            Digital transformation for businesses that actually need it.
          </h1>
          <p className="font-mono text-base text-gray-300 mb-12 leading-relaxed">
            We help mid-sized businesses and municipalities modernize how they operate — combining strategic advisory with hands-on build capability.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black px-8 py-4 font-exo font-bold tracking-widest hover:opacity-80 transition"
          >
            Let's Talk →
          </Link>
        </div>
      </div>

      {/* Empty space at bottom for visual balance */}
      <div></div>
    </section>
  );
}
