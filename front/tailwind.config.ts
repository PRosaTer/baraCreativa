/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      keyframes: {
        gradientMove: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        gradientMoveActive: {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 100%' },
        },
        shakeTwicePause: {
          '0%, 10%, 60%, 70%, 100%': { transform: 'translateX(0)' },
          '5%, 15%, 25%, 35%': { transform: 'translateX(-3px)' },
          '7.5%, 20%, 30%, 40%': { transform: 'translateX(3px)' },
          // Pausa extendida entre vibraciones del 40% al 60%
          '65%, 75%, 85%, 95%': { transform: 'translateX(-3px)' },
          '67.5%, 80%, 90%, 100%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        'gradient-move': 'gradientMove 3s ease infinite alternate',
        'gradient-move-active': 'gradientMoveActive 0.5s ease-out forwards',
        shake: 'shake 0.4s ease-in-out',
        'shake-twice-pause': 'shakeTwicePause 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
