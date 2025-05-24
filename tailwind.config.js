/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Asegúrate de que esta línea exista y sea correcta
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f0ff',
        'neon-purple': '#d400ff',
        'neon-pink': '#ff00f0',
        'neon-green': '#00ff00',
        'dark-bg': '#0a0a0a',
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'mono': ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-glow-purple': '0 0 5px #d400ff, 0 0 10px #d400ff, 0 0 15px #d400ff',
        'neon-blue-strong': '0 0 15px #00f0ff, 0 0 30px #00f0ff',
        'neon-purple-strong': '0 0 15px #d400ff, 0 0 30px #d400ff',
        'neon-pink-strong': '0 0 15px #ff00f0, 0 0 30px #ff00f0',
        'neon-green-strong': '0 0 15px #00ff00, 0 0 30px #00ff00',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
