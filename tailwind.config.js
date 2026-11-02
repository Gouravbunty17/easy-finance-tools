// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B2447',
        secondary: '#137B70',
        accent: '#E7AB57',
        neutralDark: '#182B40',
        neutralLight: '#F5F7FA',
        financeNavy: '#0B2447',
        financeTeal: '#137B70',
        financeGold: '#E7AB57',
        financeCloud: '#F5F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
