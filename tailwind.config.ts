import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#01273D",
        gold: "#C9A459",
        "light-gray": "#D2DCDF",
        graphite: "#263238",
        "graphite-soft": "#4A5960"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(1, 39, 61, 0.12)",
        form: "0 24px 70px rgba(1, 39, 61, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
