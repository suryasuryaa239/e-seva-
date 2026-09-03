/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          sky: '#0284c7',
          gold: '#d97706',
          emerald: '#059669',
          crimson: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
