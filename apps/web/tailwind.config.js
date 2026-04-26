import { themes, staticColors } from '../../packages/design-system/src/atoms/tokens/colors.ts'

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
        // Tema dinâmico via CSS variables
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        font: 'var(--color-font)',
        
        // Cores estáticas (não mudam com tema)
        mint: staticColors.mint,
        blue: staticColors.blue,
        red: staticColors.red,
        green: staticColors.green,
      },
    },
  },
  plugins: [],
}