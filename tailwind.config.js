/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7E6',
          100: '#F5EBC6',
          200: '#EBD68F',
          300: '#E0C158',
          400: '#D4AF37', // Classic Gold
          500: '#B89628',
          600: '#997B1F',
          700: '#7A6117',
          800: '#5C4810',
          900: '#3D300A',
        },
        dark: {
          900: '#0A0A0A', // Deep Black
          800: '#121212', // Rich Black
          700: '#1E1E1E', // Dark Grey
          600: '#2D2D2D',
          500: '#404040',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
