/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sb-black': '#000000',
        'sb-white': '#FFFFFF',
        'sb-gray': '#888888',
      },
      fontFamily: {
        'exo': ['Exo 2', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'h1': '3.5rem',
        'h2': '2.5rem',
        'body': '15px',
        'caption': '12px',
      },
      lineHeight: {
        'body': '1.7',
      },
      letterSpacing: {
        'tight': '-0.1em',
        'tighter': '-0.125em',
        'wide': '0.15em',
        'wider': '0.25em',
      },
      spacing: {
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '48px': '48px',
        '64px': '64px',
      },
      borderWidth: {
        'sb': '1.5px',
      },
    },
  },
  plugins: [],
};
