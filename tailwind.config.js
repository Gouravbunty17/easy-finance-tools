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
        primary: '#003366',
        secondary: '#00A8E8',
        accent: '#FFD700',
        neutralDark: '#343A40',
        neutralLight: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif'],
      },
    },
  },
  plugins: [],
}
