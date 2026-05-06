import Head from 'next/head';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Serious Business — Digital Transformation</title>
        <meta name="description" content="Digital transformation for businesses that actually need it" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <About />
        <Services />
        <Footer />
      </main>
    </>
  );
}
