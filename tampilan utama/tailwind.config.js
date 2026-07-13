/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/admin/**/*.{js,ts,jsx,tsx}",
  ],
  important: '.admin-scope',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        modalIn: 'modalIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
