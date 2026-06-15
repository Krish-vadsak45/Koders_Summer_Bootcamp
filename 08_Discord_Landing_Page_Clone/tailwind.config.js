/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        Whitney: ["Whitney"],
        Ginto: ["Ginto"],
        ggSans: ["ggSans"],
      },
    },
  },
  plugins: [],
};
