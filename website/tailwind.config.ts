import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./data/**/*.{ts,tsx,js,jsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#0A0A0A",
          pure: "#000000"
        },
        charcoal: {
          DEFAULT: "#161616",
          2: "#1F1F1F"
        },
        gold: {
          DEFAULT: "#D4AF37",
          deep: "#B8860B",
          light: "#F0D98C",
          pale: "#F5E6B8"
        },
        silver: "#C0C0C0",
        platinum: "#BFC1C2",
        cream: "#FAF6EC",
        ivory: "#FFFDF8",
        ink: "#14110C",
        muted: "#6B6455"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, #B8860B 0%, #D4AF37 45%, #F0D98C 70%, #D4AF37 100%)"
      },
      boxShadow: {
        "gold-glow": "0 0 24px -6px rgba(212,175,55,0.55)",
        "gold-glow-lg": "0 0 40px -6px rgba(212,175,55,0.7)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" }
        }
      },
      animation: {
        shimmer: "shimmer 5s linear infinite",
        kenburns: "kenburns 18s ease-out infinite alternate"
      }
    }
  },
  plugins: []
};

export default config;
