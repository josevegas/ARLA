/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe-bg': '#dbcba3',
        'cafe-surface': '#f5f2e8',
        'forest-green': '#547a55',
        'deep-green': '#214732',
        'terracotta': '#b5654e',
      },
      boxShadow: {
        'neu-flat': '9px 9px 16px #bcae8a, -9px -9px 16px #ffffff80',
        'neu-pressed': 'inset 6px 6px 12px #bcae8a, inset -6px -6px 12px #ffffff80',
        'neu-sm': '4px 4px 8px #bcae8a, -4px -4px 8px #ffffff80',
        'neu-lg': '12px 12px 24px #bcae8a, -12px -12px 24px #ffffff80',
      },
      borderRadius: {
        'cafe': '2rem',
      },
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}