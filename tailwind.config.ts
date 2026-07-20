import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  // The Clarion blog embed injects its markup at runtime, so these class names
  // never appear in the scanned source above. Without safelisting them, Tailwind
  // purges our `.clarion-blog-*` override rules in globals.css and the embed
  // falls back to Clarion's default look (and our hero layout never applies).
  safelist: [{ pattern: /^clarion-blog-/ }],
  theme: {
    extend: {
      colors: {
        // Fort Worth Wellness brand system
        ink: {
          DEFAULT: '#20303c', // deep navy — primary text / dark sections
          soft: '#31485a',
          900: '#1a2833',
        },
        steel: {
          DEFAULT: '#4a7aa4', // brand steel blue (the longhorn)
          light: '#6a97bd',
          dark: '#3a6289',
          50: '#f2f6fa',
          100: '#e2ecf3',
          200: '#c3d8e6',
        },
        sand: {
          DEFAULT: '#b29063', // warm gold/tan accent
          light: '#c8ad86',
          pale: '#e7dccb',
        },
        cream: {
          DEFAULT: '#faf7f2', // warm off-white page bg
          deep: '#f2ece2',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        wide: '1360px',
        prose: '68ch',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(32, 48, 60, 0.18)',
        card: '0 4px 24px -8px rgba(32, 48, 60, 0.14)',
        lift: '0 24px 60px -20px rgba(32, 48, 60, 0.30)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
