/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        socioverse: {
          50: "#ffe9dd",
          100: "#ffc3af",
          200: "#ff9d7e",
          300: "#ff764c",
          400: "#ff501a",
          500: "#e63700",
          600: "#b42a00",
          700: "#811d00",
          800: "#4f0f00",
          900: "#210200",
        },
      },
    },
    fontFamily: {
      sans: ['Helvetica', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Courier New', 'monospace'],
      logo: ['Bungee Spice', 'cursive']
    },
  },
  plugins: [],
  
});
