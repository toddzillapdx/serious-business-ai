import Head from 'next/head';
import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleComplete = async (transcript: string) => {
    // The API will handle sending the notification email
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Let's Talk — Serious Business</title>
        <meta name="description" content="Contact Serious Business via SeriousBot" />
      </Head>

      <main className="bg-white min-h-screen py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Column: Context */}
            <div>
              <h1 className="font-exo font-black text-5xl mb-8 tracking-tighter">
                Let's Talk.
              </h1>

              <div className="space-y-6">
                <p className="font-mono text-sm text-sb-gray leading-relaxed">
                  SeriousBot will ask you a few questions to understand what you're working on. Todd reviews every conversation personally and responds within one business day.
                </p>

                <div className="space-y-3 pt-4">
                  <p className="font-mono text-sm">— No sales pitch.</p>
                  <p className="font-mono text-sm">— No commitment.</p>
                  <p className="font-mono text-sm">— Just a real conversation.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Chat Interface */}
            <div className="h-[600px]">
              <ChatWindow onComplete={handleComplete} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
