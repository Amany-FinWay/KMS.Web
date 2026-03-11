/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
        'surface-gray': '#f8fafc',
      }
    },
  },
  plugins: [],
}