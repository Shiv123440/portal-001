/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        portal: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          violet: '#7f00ff',
          neon: '#e100ff',
          gold: '#ffd700',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
