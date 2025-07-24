/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'dark-bg': '#0F0F0F',
        'mid-dark-bg': '#1A1A1A',
        'accent-cyan': '#00FFFF',
        'accent-magenta': '#FF00FF',
        'accent-lime': '#00FF00',
        'text-light': '#E0E0E0',
        'text-muted': '#A0A0A0',
        'border-glitch': '#FF00FF',
        'glow-cyan-light': 'rgba(0, 255, 255, 0.7)',
        'glow-magenta-light': 'rgba(255, 0, 255, 0.7)',
        'glow-lime-light': 'rgba(0, 255, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'border-pulse-gradient': 'linear-gradient(90deg, var(--tw-colors-accent-cyan) 0%, var(--tw-colors-accent-magenta) 50%, var(--tw-colors-accent-cyan) 100%)',
        'diagonal-scanline': 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 5px)',
        'text-gradient-vanguard': 'linear-gradient(to right, var(--tw-colors-accent-cyan), var(--tw-colors-accent-magenta))',
      },
      keyframes: {
        'pulse-strong': {
          '0%, 100%': { opacity: 1, 'box-shadow': '0 0 5px var(--tw-shadow-color)' },
          '50%': { opacity: 0.8, 'box-shadow': '0 0 20px var(--tw-shadow-color)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glitch-effect': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'text-gradient-flow': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        'bounce-once': {
          '0%, 100%': { transform: 'translateY(0)' },
          '20%': { transform: 'translateY(-8px)' },
          '40%': { transform: 'translateY(0)' },
        },
        'pulse-light': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.95 },
        },
        'fade-in-up': {
            '0%': { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'scanIn': {
          '0%': { opacity: '0', transform: 'translateY(60px) scale(0.8)', filter: 'brightness(0.5)' },
          '30%': { opacity: '0.3', filter: 'brightness(1.5)'},
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'brightness(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        'tooltipPopIn': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(5px)', filter: 'blur(2px)' },
          '80%': { opacity: '1', transform: 'scale(1.02) translateY(0)', filter: 'blur(0)' },
          '100%': { transform: 'scale(1)' },
        },
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
          '65%, 75%, 85%, 95%': { transform: 'translateX(-3px)' },
          '67.5%, 80%, 90%, 100%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        'pulse-strong': 'pulse-strong 2s infinite alternate ease-in-out',
        'shimmer-slow': 'shimmer 4s infinite linear',
        'shimmer-fast': 'shimmer 2s infinite linear',
        'glitch-subtle': 'glitch-effect 0.5s infinite alternate ease-in-out',
        'text-flow': 'text-gradient-flow 3s infinite alternate linear',
        'bounce-once': 'bounce-once 0.6s ease-in-out',
        'pulse-light': 'pulse-light 4s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scan-in-effect': 'scanIn 0.9s ease-out forwards',
        'tooltip-pop-in': 'tooltipPopIn 0.3s ease-out forwards',
        'gradient-move': 'gradientMove 3s ease infinite alternate',
        'gradient-move-active': 'gradientMoveActive 0.5s ease-out forwards',
        'shake-twice-pause': 'shakeTwicePause 2s ease-in-out forwards',
      },
      dropShadow: {
        'cyber-glow-cyan': '0 0 15px var(--tw-colors-accent-cyan), 0 0 30px var(--tw-colors-accent-cyan)',
        'cyber-glow-magenta': '0 0 15px var(--tw-colors-accent-magenta), 0 0 30px var(--tw-colors-accent-magenta)',
        'cyber-glow-lime': '0 0 15px var(--tw-colors-accent-lime), 0 0 30px var(--tw-colors-accent-lime)',
      },
      boxShadow: {
        'panel-inner': 'inset 0 0 10px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(255, 0, 255, 0.1)',
        'panel-outer': '0 0 15px var(--tw-colors-accent-cyan), 0 0 30px var(--tw-colors-accent-magenta)',
      }
    },
  },
  plugins: [
    require('tailwindcss-animation-delay'),
  ],
};