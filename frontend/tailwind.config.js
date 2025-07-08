/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Obviously"', "sans-serif"], // This overrides default sans
        obviously: ['"Obviously"', "sans-serif"],
      },
      backgroundImage: {
        retro: "url('/images/Retro_baground.png')",
      },
      fontFamily: {
        "obviously-wide": ["ObviouslyWide-Regular", "sans-serif"],
        "obviously-medium": ["ObviouslyWide-Medium", "sans-serif"],
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
