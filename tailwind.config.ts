import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#163B65",
        accent: "#B9975B",
        ink: "#0F172A",
        mist: "#E2E8F0",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        glow: "radial-gradient(circle at top, rgba(22, 59, 101, 0.08), transparent 42%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
