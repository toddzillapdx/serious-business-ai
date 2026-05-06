export default function About() {
  return (
    <section className="bg-white text-black py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Text */}
          <div>
            <h2 className="font-exo font-black text-4xl mb-8 tracking-tighter">
              WHO WE ARE
            </h2>
            <div className="space-y-6">
              <p className="font-mono text-sm leading-relaxed">
                Serious Business is the practice of Todd Ames — a digital transformation leader with 25 years of experience building first-of-kind products and experiences at global scale. From launching Nike's mobile customization platform to creating the world's first geo-located retail app at adidas to driving $30M+ in revenue through the brand's first NFT collaboration — Todd has spent his career going where others haven't been yet.
              </p>
              <p className="font-mono text-sm leading-relaxed">
                Now he brings that same capability to mid-sized businesses and municipalities in the Pacific Northwest — organizations that need enterprise-grade thinking without the enterprise price tag or the enterprise bureaucracy.
              </p>
            </div>
          </div>

          {/* Right: Structural graphic (grid pattern) */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square border border-black" style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
