// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}', // Asegúrate de que esta ruta sea correcta si tus componentes están en 'src'
  ],
  theme: {
    extend: {
      colors: {
        // --- ¡MUY IMPORTANTE! Mantenemos el color 'primary' para tu Navbar ---
        primary: 'var(--color-primary)', // Esto asegura que tu Navbar use #282323 desde globals.css
        
        // --- Paleta de colores vanguardista y de alto contraste para el CONTENIDO (CursoDetalle) ---
        'dark-bg': '#0F0F0F', // Fondo muy oscuro, casi negro para el CursoDetalle
        'mid-dark-bg': '#1A1A1A', // Para contenedores internos y tarjetas del CursoDetalle
        'accent-cyan': '#00FFFF', // Cian eléctrico para acentos y brillos
        'accent-magenta': '#FF00FF', // Magenta vibrante para acentos y brillos
        'accent-lime': '#00FF00', // Verde lima brillante para acentos y estados "disponible"
        'text-light': '#E0E0E0', // Texto principal claro para legibilidad
        'text-muted': '#A0A0A0', // Texto secundario/descriptivo con menor prominencia
        'border-glitch': '#FF00FF', // Color específico para efectos de borde "glitch"
        // Colores para sombras de neón (pueden ser los mismos que los acentos o variaciones)
        'glow-cyan-light': 'rgba(0, 255, 255, 0.7)',
        'glow-magenta-light': 'rgba(255, 0, 255, 0.7)',
        'glow-lime-light': 'rgba(0, 255, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Nuevos gradientes para brillos animados y fondos de patrón
        'border-pulse-gradient': 'linear-gradient(90deg, var(--tw-colors-accent-cyan) 0%, var(--tw-colors-accent-magenta) 50%, var(--tw-colors-accent-cyan) 100%)',
        'diagonal-scanline': 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 5px)',
        // Gradiente para el texto del título
        'text-gradient-vanguard': 'linear-gradient(to right, var(--tw-colors-accent-cyan), var(--tw-colors-accent-magenta))',
      },
      keyframes: {
        // --- Keyframes para animaciones vanguardistas ---
        'pulse-strong': { // Pulso más notorio para elementos clave
          '0%, 100%': { opacity: 1, 'box-shadow': '0 0 5px var(--tw-shadow-color)' },
          '50%': { opacity: 0.8, 'box-shadow': '0 0 20px var(--tw-shadow-color)' },
        },
        'shimmer': { // Efecto de brillo que se desliza
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glitch-effect': { // Efecto de glitch visual
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'text-gradient-flow': { // Degradado de texto que fluye
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        // Keyframes que tenías originalmente y ajustados
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
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
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
        // --- Animaciones vanguardistas ---
        'pulse-strong': 'pulse-strong 2s infinite alternate ease-in-out',
        'shimmer-slow': 'shimmer 4s infinite linear',
        'shimmer-fast': 'shimmer 2s infinite linear',
        'glitch-subtle': 'glitch-effect 0.5s infinite alternate ease-in-out',
        'text-flow': 'text-gradient-flow 3s infinite alternate linear',
        // Animaciones ajustadas/mantenidas
        'bounce-once': 'bounce-once 0.6s ease-in-out',
        'pulse-light': 'pulse-light 4s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
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
  plugins: [],
};