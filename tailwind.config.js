/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        '7': '7 7 0%',
        '17': '17 17 0%',
      },
      colors: {
        'background-default-hover': '#f5f6f6',
      }
    },
  },
  plugins: [],
}
