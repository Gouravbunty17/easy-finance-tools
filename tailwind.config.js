// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-800': '#065f46',
        'emerald-200': '#a7f3d0',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
