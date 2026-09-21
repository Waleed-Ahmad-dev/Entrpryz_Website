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
        background: "#080A0D",
        foreground: "#F5F5F5",
        brand: {
          DEFAULT: "#FF7A18",
          orange: "#FF7A18",
          amber: "#FF9D3D",
          hover: "#E56800",
        },
        surface: {
          DEFAULT: "#12161B",
          dark: "#080A0D",
          card: "#12161B",
          border: "#222830",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#9BA2AD",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["monospace"],
      },
      letterSpacing: {
        h1: "-0.03em",
        h2: "-0.02em",
      },
    },
  },
  plugins: [],
};
export default config;
