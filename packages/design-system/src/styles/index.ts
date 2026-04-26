// Global styles export
import './global.css';

// CSS Variables and Design Tokens
export const tokens = {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
  },
  // Add more design tokens here as needed
} as const;

// Re-export all design system components and hooks
export * from '../atoms';
export * from '../molecules';
export * from '../organisms';
export * from '../hooks'; // Theme hooks