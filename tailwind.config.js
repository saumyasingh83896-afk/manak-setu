/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bis: {
          navy: '#0b2545',
          dark: '#13315c',
          blue: '#134074',
          accent: '#1d4ed8',
          light: '#eef4f8',
          saffron: '#f58220',
          saffronDark: '#d96c14',
          gold: '#d4af37',
          green: '#059669',
          greenDark: '#047857'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 37, 69, 0.08), 0 2px 6px -1px rgba(11, 37, 69, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(11, 37, 69, 0.12), 0 4px 10px -2px rgba(11, 37, 69, 0.06)',
        'glow': '0 0 15px rgba(245, 130, 32, 0.3)',
      }
    },
  },
  plugins: [],
}
