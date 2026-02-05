/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f9f4", // Very subtle green tint
        surface: "#ffffff",
        primary: {
          DEFAULT: "#2c5e2e", // Dark Forest Green (Primary Brand)
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a3b18a", // Sage Green
          foreground: "#1a1a1a",
        },
        muted: {
          DEFAULT: "#e5e7eb",
          foreground: "#6b7280",
        },
        border: "#e2e8f0",
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        neon: "0 4px 20px rgba(57, 255, 20, 0.2)",
        "neon-pink": "0 4px 20px rgba(0, 255, 157, 0.2)",
        card: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
