/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        foreground: "var(--color-foreground)",
        muted: "#6b7280",
        border: "#e5e7eb",
        accent: "#3b82f6",
        font: "var(--color-font)",
        mint: "#cbf5e5",
        blue: "#4f46e5",
        red: "#ef4444",
        green: "#10b981",
      },
    },
  },
  plugins: [],
};
