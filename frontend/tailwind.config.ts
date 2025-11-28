import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Duolingo-inspired font families
        display: ['var(--font-baloo)', 'system-ui', 'sans-serif'],
        title: ['var(--font-mitr)', 'system-ui', 'sans-serif'],
        body: ['var(--font-quicksand)', 'system-ui', 'sans-serif'],
        ui: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
        button: ['var(--font-varela)', 'system-ui', 'sans-serif'],
        // Legacy fonts
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        // Display & Hero text - Baloo 2 (Playful, rounded)
        'display-1': ['3.5rem', {
          lineHeight: '1.1',
          fontWeight: '800',
          letterSpacing: '-0.02em',
        }],
        'display-2': ['3rem', {
          lineHeight: '1.1',
          fontWeight: '800',
          letterSpacing: '-0.02em',
        }],

        // Headings - Baloo 2 & Mitr (Bold, friendly)
        'heading-1': ['2.25rem', {
          lineHeight: '1.2',
          fontWeight: '700',
          letterSpacing: '-0.01em',
        }],
        'heading-2': ['1.875rem', {
          lineHeight: '1.3',
          fontWeight: '600',
        }],
        'heading-3': ['1.5rem', {
          lineHeight: '1.3',
          fontWeight: '600',
        }],

        // Titles - Mitr (Medium weight, clear)
        'title': ['1.25rem', {
          lineHeight: '1.4',
          fontWeight: '500',
        }],
        'title-sm': ['1.125rem', {
          lineHeight: '1.4',
          fontWeight: '500',
        }],

        // Body text - Quicksand (Readable, friendly)
        'body-lg': ['1.125rem', {
          lineHeight: '1.6',
          fontWeight: '500',
        }],
        'body': ['1rem', {
          lineHeight: '1.6',
          fontWeight: '500',
        }],
        'body-sm': ['0.9375rem', {
          lineHeight: '1.5',
          fontWeight: '500',
        }],

        // UI Text - Lexend (Clean, modern)
        'caption': ['0.875rem', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'small': ['0.75rem', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'tiny': ['0.6875rem', {
          lineHeight: '1.4',
          fontWeight: '400',
        }],

        // Button text - Varela Round (Rounded, friendly)
        'button-lg': ['1.125rem', {
          lineHeight: '1',
          fontWeight: '400',
          letterSpacing: '0.02em',
        }],
        'button': ['1rem', {
          lineHeight: '1',
          fontWeight: '400',
          letterSpacing: '0.02em',
        }],
        'button-sm': ['0.875rem', {
          lineHeight: '1',
          fontWeight: '400',
          letterSpacing: '0.02em',
        }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
