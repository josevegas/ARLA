/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neumorphism': '9px 9px 16px rgba(0,0,0,0.1), -9px -9px 16px rgba(255,255,255,0.7)',
        'neumorphism-inset': 'inset 9px 9px 16px rgba(0,0,0,0.1), inset -9px -9px 16px rgba(255,255,255,0.7)',
      },
      colors: {
        'pastel-gray': '#f5f5f5',
        'pastel-cream': '#fefefe',
      },
    },
  },
  plugins: [],
}