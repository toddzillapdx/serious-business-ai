import type { AppProps } from 'next/app';
import { Exo_2, IBM_Plex_Mono } from 'next/font/google';
import '../styles/globals.css';

const exo2 = Exo_2({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${exo2.variable} ${ibmPlexMono.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
