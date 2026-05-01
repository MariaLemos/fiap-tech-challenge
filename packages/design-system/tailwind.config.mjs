import { themes, staticColors } from './src/atoms/tokens/colors.ts'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Incluir apps que usam o design system
    '../../apps/web/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Forçar geração das utilities essenciais
    'flex',
    'justify-end',
    'justify-start', 
    'items-center',
    'gap-2',
    'p-4',
    'p-6',
    'px-4',
    'py-2',
    'm-4',
    'h-16',
    'h-10',
    'h-4',
    'w-4',
    'w-full',
    'rounded-md',
    'rounded',
    'rounded-lg',
    'rounded-full',
    'text-white',
    'text-black',
    'text-2xl',
    'text-xl',
    'text-lg',
    'font-bold',
    'cursor-pointer',
    'transition-colors',
    'bg-blue-500',
    'bg-mint-500',
    'bg-primary',
    'bg-background',
    'bg-surface',
    'bg-foreground',
    'text-foreground',
    'text-font',
    'text-muted',
    'border-border',
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