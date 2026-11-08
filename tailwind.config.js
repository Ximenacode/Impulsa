/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petroleo: {
          50: '#F0F7F8',
          100: '#E1F0F2',
          200: '#C3E1E4',
          300: '#94C9CF',
          400: '#5EAAB4',
          500: '#388B97',
          600: '#23707B',
          700: '#15565F', // Primary Verde Petróleo
          800: '#0F444C',
          900: '#0A3137',
          950: '#041B1F',
        },
        superficie: {
          base: '#F8FAFC',
          panel: '#FFFFFF',
          borde: '#E2E8F0',
          subtexto: '#64748B',
          texto: '#0F172A',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
