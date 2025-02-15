import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Dracula theme colors
        background: "#282a36",
        currentLine: "#44475a",
        foreground: "#f8f8f2",
        comment: "#6272a4",
        cyan: "#8be9fd",
        green: "#50fa7b",
        orange: "#ffb86c",
        pink: "#ff79c6",
        purple: "#bd93f9",
        red: "#ff5555",
        yellow: "#f1fa8c",

        border: "#44475a",
        input: "#44475a",
        ring: "#bd93f9",
        
        // Semantic colors
        primary: {
          DEFAULT: "#bd93f9",
          foreground: "#282a36",
        },
        secondary: {
          DEFAULT: "#6272a4",
          foreground: "#f8f8f2",
        },
        destructive: {
          DEFAULT: "#ff5555",
          foreground: "#f8f8f2",
        },
        muted: {
          DEFAULT: "#44475a",
          foreground: "#6272a4",
        },
        accent: {
          DEFAULT: "#44475a",
          foreground: "#f8f8f2",
        },
        popover: {
          DEFAULT: "#282a36",
          foreground: "#f8f8f2",
        },
        card: {
          DEFAULT: "#282a36",
          foreground: "#f8f8f2",
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}