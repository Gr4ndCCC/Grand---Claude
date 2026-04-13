/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Ember Brand System ───────────────────────────────────
        'ember-bg':       '#0A0A0A',
        'ember-surface':  '#111111',
        'ember-surface2': '#1A1A1A',
        'ember-surface3': '#222222',
        'ember-border':   'rgba(255,255,255,0.08)',

        // Brand
        'ember-maroon':   '#800000',
        'ember-maroon-l': '#990000',
        'ember-maroon-d': '#5A0000',
        'ember-beige':    '#E4CFB3',
        'ember-beige-d':  '#C8AE8E',
        'ember-gold':     '#B8860B',
        'ember-gold-l':   '#DAA520',

        // Text
        'ember-cream':    '#FFFFFF',
        'ember-text':     '#A0A0A0',
        'ember-muted':    '#5A5A5A',

        // Legacy aliases (for existing components)
        'ember-orange':   '#800000',
        'ember-orange-l': '#990000',
        'ember-amber':    '#E4CFB3',
        'ember-red':      '#800000',
        'ember-subtle':   '#5A5A5A',
        'ember-green':    '#3ECF8E',
        'ember-blue':     '#38BDF8',
      },
      fontFamily: {
        sans:    ['system-ui', '-apple-system', 'sans-serif'],
        serif:   ['Georgia', '"Times New Roman"', 'serif'],
        display: ['Georgia', '"Times New Roman"', 'serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'maroon-gradient':  'linear-gradient(135deg, #800000 0%, #990000 100%)',
        'dark-gradient':    'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'glow-maroon':      'radial-gradient(ellipse at center, rgba(128,0,0,0.25) 0%, transparent 70%)',
        'glow-beige':       'radial-gradient(ellipse at center, rgba(228,207,179,0.08) 0%, transparent 70%)',
        'card-shine':       'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)',
        // Legacy
        'fire-gradient':    'linear-gradient(135deg, #800000 0%, #E4CFB3 100%)',
        'fire-gradient-v':  'linear-gradient(180deg, #800000 0%, #5A0000 100%)',
        'glow-orange':      'radial-gradient(ellipse at center, rgba(128,0,0,0.15) 0%, transparent 70%)',
        'glow-amber':       'radial-gradient(ellipse at center, rgba(228,207,179,0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'maroon':       '0 0 30px rgba(128,0,0,0.40)',
        'maroon-lg':    '0 0 60px rgba(128,0,0,0.25)',
        'beige-glow':   '0 0 20px rgba(228,207,179,0.15)',
        'card':         '0 4px 24px rgba(0,0,0,0.60)',
        'card-hover':   '0 12px 48px rgba(0,0,0,0.80)',
        'inset-border': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        // Legacy
        'ember':        '0 0 20px rgba(128,0,0,0.30)',
        'ember-lg':     '0 0 40px rgba(128,0,0,0.20)',
        'amber':        '0 0 20px rgba(228,207,179,0.15)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease-out',
        'slide-up':     'slideUp 0.6s ease-out',
        'float':        'float 4s ease-in-out infinite',
        'pulse-maroon': 'pulseMaroon 3s ease-in-out infinite',
        // Legacy
        'pulse-ember':  'pulseMaroon 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseMaroon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(128,0,0,0.30)' },
          '50%':      { boxShadow: '0 0 60px rgba(128,0,0,0.55)' },
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
