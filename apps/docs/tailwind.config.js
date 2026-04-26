/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Incluir design system para garantir scan das classes
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          500: 'oklch(0.72 0.11 178)',
        },
        primary: {
          DEFAULT: '#6750A4',
        },
      },
    },
  },
  plugins: [],
}