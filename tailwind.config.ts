import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Lumina Travel design tokens (from Section 2 of the build plan)
        navy: {
          DEFAULT: "#0B1F3A", // primary/dark surfaces, buttons, nav
          light: "#16294A",
        },
        rust: {
          DEFAULT: "#B5541A", // CTA accent -- "Proceed to Booking", "Continue"
          light: "#C96A31",
        },
        page: "#EEF2F7", // page background
        card: "#FFFFFF", // card background
        muted: "#6B7280", // muted text
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
