interface ServiceBlockProps {
  headline: string;
  descriptor: string;
}

export default function ServiceBlock({ headline, descriptor }: ServiceBlockProps) {
  return (
    <div className="pb-12 border-b border-gray-700 last:border-b-0">
      <h3 className="font-exo font-black text-white text-2xl mb-6 tracking-wide">
        {headline}
      </h3>
      <p className="font-mono text-gray-300 text-base leading-relaxed">
        {descriptor}
      </p>
    </div>
  );
}
