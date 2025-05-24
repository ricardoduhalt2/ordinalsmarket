/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f0ff',
        'neon-purple': '#d400ff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff9d',
        'dark-bg': '#0a0a0a',
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'mono': ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px #00f0ff, 0 0 15px #00f0ff, 0 0 30px #00f0ff',
        'neon-purple': '0 0 5px #d400ff, 0 0 15px #d400ff, 0 0 30px #d400ff',
        'neon-pink': '0 0 5px #ff00ff, 0 0 15px #ff00ff, 0 0 30px #ff00ff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 15s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}