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
        'dark-bg': '#0a0a0a',
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'mono': ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
