/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'devanagari': ['Noto Sans Devanagari', 'sans-serif'],
        'serif': ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}
