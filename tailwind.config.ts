import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDeepest: "var(--bg-deepest)",
        bgDeep: "var(--bg-deep)",
        bgCard: "var(--bg-card)",
        bgElevated: "var(--bg-elevated)",
        bgHover: "var(--bg-hover)",
        tvGreen: "var(--green)",
        tvGreenDim: "var(--green-dim)",
        tvRed: "var(--red)",
        tvRedDim: "var(--red-dim)",
        tvAmber: "var(--amber)",
        tvBlue: "var(--blue)",
        tvPurple: "var(--purple)",
        tvCyan: "var(--cyan)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        borderMain: "var(--border)",
        borderHover: "var(--border-hover)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "mesh-gradient": "meshGradient 30s ease infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        meshGradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        }
      },
      backgroundImage: {
        'gradient-card': 'var(--gradient-card)',
        'gradient-green': 'var(--gradient-green)',
        'gradient-red': 'var(--gradient-red)',
        'gradient-blue': 'var(--gradient-blue)',
        'gradient-purple': 'var(--gradient-purple)',
      }
    },
  },
  plugins: [],
} satisfies Config

export default config
