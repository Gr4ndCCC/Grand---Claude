/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        'ember-bg':       '#0C0A09',
        'ember-surface':  '#161310',
        'ember-surface2': '#1F1A16',
        'ember-surface3': '#2A231C',
        'ember-border':   '#332B22',

        // Brand — fire gradient
        'ember-orange':   '#FF5C1A',
        'ember-orange-l': '#FF7A3D',
        'ember-amber':    '#FFAA33',
        'ember-gold':     '#FFD166',
        'ember-red':      '#E8341A',

        // Text
        'ember-cream':    '#F5EEE6',
        'ember-muted':    '#9B8A7A',
        'ember-subtle':   '#5C4F44',

        // Semantic
        'ember-green':    '#3ECF8E',
        'ember-blue':     '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #FF5C1A 0%, #FFAA33 100%)',
        'fire-gradient-v': 'linear-gradient(180deg, #FF5C1A 0%, #E8341A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0C0A09 0%, #161310 100%)',
        'glow-orange': 'radial-gradient(ellipse at center, rgba(255,92,26,0.15) 0%, transparent 70%)',
        'glow-amber': 'radial-gradient(ellipse at center, rgba(255,170,51,0.12) 0%, transparent 70%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)',
      },
      boxShadow: {
        'ember': '0 0 20px rgba(255,92,26,0.25)',
        'ember-lg': '0 0 40px rgba(255,92,26,0.20)',
        'amber': '0 0 20px rgba(255,170,51,0.20)',
        'card': '0 4px 24px rgba(0,0,0,0.40)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.50)',
        'inset-border': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-ember': 'pulseEmber 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseEmber: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,92,26,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(255,92,26,0.45)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}
