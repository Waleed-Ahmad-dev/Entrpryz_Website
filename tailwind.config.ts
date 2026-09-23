import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand-orange) / <alpha-value>)",
          orange: "rgb(var(--brand-orange) / <alpha-value>)",
          amber: "rgb(var(--brand-amber) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
        },
        surface: {
          dark: "rgb(var(--surface-dark) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)",
          border: "rgb(var(--surface-border) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
export default config;