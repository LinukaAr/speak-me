/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:      '#07070f',
        surf:    '#0d0d1a',
        card:    '#111120',
        border:  '#1c1c2e',
        border2: '#272740',
        red:     '#e8365d',
        red2:    '#ff6b87',
        amber:   '#f59e0b',
        green:   '#10d98a',
        blue:    '#3b82f6',
        purple:  '#8b5cf6',
        ink:     '#f0eff6',
        muted:   '#6b6b8a',
        subtle:  '#2a2a42',
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
