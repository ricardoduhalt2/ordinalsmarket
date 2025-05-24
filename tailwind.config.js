/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wp-gold': '#F7B538',
        'wp-dark': '#1A1A1A',
        'wp-light': '#F5F5F5',
        'wp-accent': '#DB9A1D',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(247, 181, 56, 0.3)',
        'gold-hover': '0 0 25px rgba(247, 181, 56, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}