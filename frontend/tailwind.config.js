/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534'
        }
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '800',
      }
    }
  },
  plugins: []
}
