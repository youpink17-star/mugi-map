import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07071F",
        "navy-soft": "#080822",
        ink: "#111827",
        pink: "#E0487C",
        purple: "#8B5CF6",
        "soft-pink": "#FFF0F7",
        "app-bg": "#F7F7FA",
        line: "#E8E8EF",
        muted: "#6B7280",
      },
      maxWidth: {
        app: "430px",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 8px 30px rgba(7,7,31,0.06)",
        cta: "0 10px 30px rgba(224,72,124,0.30)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Pretendard Variable",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "pink-grad": "linear-gradient(135deg, #E7598A 0%, #D83E73 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
