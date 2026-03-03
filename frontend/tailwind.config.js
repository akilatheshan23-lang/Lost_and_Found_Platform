/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        // subtle shadow that works well on light backgrounds
        soft: '0 12px 30px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}
