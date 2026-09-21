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
      },
      letterSpacing: {
        h1: "-0.02em",
        h2: "-0.01em",
        nav: "0.02em",
        label: "0.05em",
        cta: "0.02em",
      },
    },
  },
  plugins: [],
};
export default config;
