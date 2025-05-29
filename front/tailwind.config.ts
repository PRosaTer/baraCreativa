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
      },
      animation: {
        'gradient-move': 'gradientMove 3s ease infinite alternate',
        'gradient-move-active': 'gradientMoveActive 0.5s ease-out forwards', 
      },
    },
  },
  plugins: [],
};