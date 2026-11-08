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
          50: '#F0F7F9',
          100: '#E1EFF2',
          200: '#C6E2E7',
          300: '#9ECAD2',
          400: '#6AAAB7',
          500: '#428E9E',
          600: '#277383',
          700: '#145965', // Verde petróleo principal
          800: '#103E46', // Verde petróleo oscuro
          900: '#0C2E34',
          950: '#06191D',
        },
        fondo: '#F5F7F8',       // Fondo general
        superficie: '#FFFFFF',  // Superficies
        texto: {
          principal: '#172B35', // Texto principal
          secundario: '#526571',// Texto secundario
          terciario: '#8396A2', // Texto atenuado
        },
        borde: {
          suave: '#DFE7EB',     // Bordes suaves
          medio: '#CBD6DC',
        },
        acento: {
          calido: '#E5AF63',    // Acento cálido moderado
          calidoLight: '#FBF4EB',
          calidoBorder: '#F5D8B0',
        },
        estado: {
          vencidoText: '#912018',
          vencidoBg: '#FEF3F2',
          vencidoBorder: '#FECDCA',
          hoyText: '#145965',
          hoyBg: '#EBF5F7',
          hoyBorder: '#C6E2E7',
          proximoText: '#344054',
          proximoBg: '#F2F4F7',
          proximoBorder: '#EAECF0',
          ganadoText: '#027A48',
          ganadoBg: '#ECFDF3',
          ganadoBorder: '#A6F4C5',
          perdidoText: '#475467',
          perdidoBg: '#F2F4F7',
          perdidoBorder: '#D0D5DD',
        }
      },
      borderRadius: {
        'tarjeta': '14px',
      },
      boxShadow: {
        'tarjeta': '0 1px 3px 0 rgba(23, 43, 53, 0.04), 0 1px 2px -1px rgba(23, 43, 53, 0.04)',
        'elevada': '0 4px 6px -1px rgba(23, 43, 53, 0.06), 0 2px 4px -2px rgba(23, 43, 53, 0.04)',
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
