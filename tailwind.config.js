/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF7A00",
          50: "#FFF3E8",
          100: "#FFE6D1",
          200: "#FFC8A3",
          300: "#FFA975",
          400: "#FF8B47",
          500: "#FF7A00",
          600: "#CC6200",
          700: "#994900",
          800: "#663100",
          900: "#331800"
        }
      }
    }
  },
  plugins: []
}
