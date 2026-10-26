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
        ivory: {
          DEFAULT: "#FBF9F5",
          subtle: "#F4EFEA",
          muted: "#EAE4DC",
        },
        espresso: {
          DEFAULT: "#161311",
          surface: "#211D1A",
          elevated: "#2C2723",
        },
        ink: {
          DEFAULT: "#12100E",
          muted: "#6E6862",
          subtle: "#9E9790",
        },
        cognac: {
          DEFAULT: "#8E4A23",
          hover: "#A2582A",
          muted: "#B86F3E",
        },
        border: {
          light: "rgba(18, 16, 14, 0.08)",
          subtle: "rgba(18, 16, 14, 0.14)",
          dark: "rgba(251, 249, 245, 0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-geist)", "system-ui", "-apple-system", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      letterSpacing: {
        kicker: "0.28em",
        editorial: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
