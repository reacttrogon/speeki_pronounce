/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // FIXED: Remove duplicates and use consistent naming
        obviously: ["Obviously", "Inter", "sans-serif"],
        "obviously-wide": ["ObviouslyWide", "Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        retro: "url('/speeki_pronounce/images/Retro_baground.png')", // Fixed path for production
      },
      animation: {
        "pulse-custom": "pulse 1.5s infinite",
        blink: "blink 1s infinite",
      },
      keyframes: {
        blink: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.3" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
