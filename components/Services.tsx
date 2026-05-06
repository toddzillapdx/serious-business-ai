import ServiceBlock from './ServiceBlock';

const services = [
  {
    headline: 'OPERATIONS AUTOMATION',
    descriptor: 'Connecting your systems, eliminating manual work, and building workflows that run without you.',
  },
  {
    headline: 'DATA VISIBILITY',
    descriptor: 'Real-time dashboards that turn your existing data into decisions your leadership can act on.',
  },
  {
    headline: 'CONSUMER & CITIZEN EXPERIENCE',
    descriptor: 'Modern web and mobile experiences that serve your customers or constituents the way they expect to be served.',
  },
  {
    headline: 'AI AUGMENTATION',
    descriptor: 'Practical AI layered into your existing operations — not hype, not demos. Systems that work.',
  },
];

export default function Services() {
  return (
    <section className="bg-black text-white py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {services.map((service, idx) => (
            <ServiceBlock
              key={idx}
              headline={service.headline}
              descriptor={service.descriptor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
