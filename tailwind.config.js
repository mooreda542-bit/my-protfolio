/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030305',
          900: '#07070d',
          850: '#0d0d18',
          800: '#131324',
          700: '#1c1c33',
          600: '#272744',
        },
        cyber: {
          purple: '#8b5cf6',
          violet: '#a855f7',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'gradient-x': 'gradientX 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        }
      }
    },
  },
  plugins: [],
}

