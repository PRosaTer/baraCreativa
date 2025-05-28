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
},

  },
  plugins: [],
};
