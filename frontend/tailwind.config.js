/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:      '#001f2b',
        surf:    '#00293a',
        card:    '#00324a',
        border:  '#00415a',
        border2: '#005373',
        // primary
        blue:    '#00b8ff',
        blue2:   '#009bd6',
        blue3:   '#00719c',
        blue4:   '#00415a',
        // accents
        red:     '#ff4d6d',
        red2:    '#ff7a91',
        amber:   '#f59e0b',
        green:   '#00e5a0',
        purple:  '#7c9fff',
        // text
        ink:     '#e8f6ff',
        muted:   '#5b8fa8',
        subtle:  '#00415a',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease infinite',
        'wave':      'wave 1.2s ease infinite',
        'fade-up':   'fade-up 0.4s ease both',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        'pulse-dot': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(1.4)' } },
        'wave':      { '0%,100%': { transform: 'scaleY(0.3)' }, '50%': { transform: 'scaleY(1)' } },
        'fade-up':   { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
