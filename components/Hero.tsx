import Link from 'next/link';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="bg-black text-white min-h-screen flex flex-col justify-center p-8">
      {/* Center content with clear vertical hierarchy */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Icon - much larger, visual anchor */}
        <div className="mb-12 text-7xl font-exo font-black">
          [SB]
        </div>

        {/* Wordmark + date stacked vertically */}
        <div className="mb-16">
          <div className="text-2xl font-exo font-black tracking-widest mb-2">
            SERIOUS BUSINESS
          </div>
          <div className="text-xs font-mono text-gray-400 tracking-widest">
            EST 2025
          </div>
        </div>

        {/* Headline - larger, breezier */}
        <h1 className="font-exo font-black text-6xl lg:text-7xl mb-12 tracking-wide leading-relaxed max-w-3xl">
          Digital transformation for businesses that actually need it.
        </h1>

        {/* Descriptor */}
        <p className="font-mono text-base text-gray-300 mb-16 leading-relaxed max-w-2xl">
          We help mid-sized businesses and municipalities modernize how they operate — combining strategic advisory with hands-on build capability.
        </p>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-block bg-white text-black px-10 py-4 font-exo font-bold tracking-wider hover:opacity-80 transition text-lg"
        >
          Let's Talk →
        </Link>
      </div>
    </section>
  );
}
