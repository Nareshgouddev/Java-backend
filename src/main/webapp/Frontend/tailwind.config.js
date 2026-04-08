/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        blog: {
          bg: "#0e0f11",
          card: "#141618",
          sidebar: "#111214",
          border: "#1f2125",
          borderHover: "#2e7d32",
          text: "#d8d9db",
          textMuted: "#6b7280",
          textDim: "#4b5563",
          accent: "#39d353",
          accentDim: "#1a4d26",
          accentGlow: "rgba(57, 211, 83, .18)",
          red: "#f97316",
          blue: "#38bdf8",
          yellow: "#facc15"
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
        body: ['Source Serif 4', 'Georgia', 'serif'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        ticker: 'ticker 28s linear infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: 0 },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
