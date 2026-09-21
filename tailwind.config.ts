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
          DEFAULT: "#15191E",
          dark: "#080A0D",
          card: "#15191E",
          border: "#262D35",
          hover: "#1D232A",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#A7ADB5",
        },
        muted: {
          DEFAULT: "#15191E",
          foreground: "#A7ADB5",
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
        nav: "0.02em",
        label: "0.08em",
        cta: "0.04em",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
