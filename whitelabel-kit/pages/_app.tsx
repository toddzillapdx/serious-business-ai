import type { AppProps } from 'next/app';
import { IBM_Plex_Mono } from 'next/font/google';
import '../styles/globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={ibmPlexMono.variable}>
      <Component {...pageProps} />
    </div>
  );
}
