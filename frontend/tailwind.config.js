/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          950: '#040d09',
          900: '#071710',
          850: '#0b241a',
          800: '#103325',
          700: '#164834',
          600: '#1f664a',
          500: '#2aa274',
          400: '#34d399',
        },
        hazard: {
          amber: '#fbbf24',
          yellow: '#f59e0b',
          red: '#ef4444',
          darkRed: '#991b1b',
        },
        tactical: {
          card: '#0a1a12',
          border: '#1b3a2b',
          header: '#05110b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
