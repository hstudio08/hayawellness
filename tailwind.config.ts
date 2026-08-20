import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "#0B4035",
          secondary: "#155A4B",
          teal: "#197565",
        },
        blue: {
          soft: "#EAF4F7",
          light: "#F4F8FA",
        },
        ivory: {
          warm: "#FAF9F5",
        },
        text: {
          dark: "#163C35",
          muted: "#63756F",
        },
        gold: {
          subtle: "#C9A44C",
        },
        background: "#FAF9F5", // Warm Ivory as default background
      },
      fontFamily: {
        serif: ["var(--font-cormorant-garamond)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
