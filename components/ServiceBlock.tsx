interface ServiceBlockProps {
  headline: string;
  descriptor: string;
}

export default function ServiceBlock({ headline, descriptor }: ServiceBlockProps) {
  return (
    <div className="pb-8 mb-8 border-b border-white">
      <h3 className="font-exo font-black text-white text-xl mb-4 tracking-tighter">
        {headline}
      </h3>
      <p className="font-mono text-white text-sm leading-relaxed">
        {descriptor}
      </p>
    </div>
  );
}
