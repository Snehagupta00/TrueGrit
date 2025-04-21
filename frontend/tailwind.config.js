/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', 
        secondary: '#6B7280', 
        accent: '#F3F4F6', 
      },
    },
  },
  plugins: [],
};