/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#F97316', hover: '#EA6A00', light: '#FFEDD5' },
        secondary: { DEFAULT: '#10B981', hover: '#059669' },
        accent:    { DEFAULT: '#6366F1', hover: '#4F46E5' },
        brand: {
          orange: '#F97316',
          green:  '#10B981',
          blue:   '#6366F1',
          red:    '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};