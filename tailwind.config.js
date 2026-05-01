/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon:        'var(--maroon)',
        'maroon-light':'var(--maroon-light)',
        'maroon-deep': 'var(--maroon-deep)',
        beige:         'var(--beige)',
        'beige-soft':  'var(--beige-soft)',
        'beige-muted': 'var(--beige-muted)',
        gold:          'var(--gold)',
        'gold-bright': 'var(--gold-bright)',
        bg:            'var(--bg)',
        'bg-raised':   'var(--bg-raised)',
        'bg-card':     'var(--bg-card)',
        text:          'var(--text)',
        'text-mid':    'var(--text-mid)',
        'text-soft':   'var(--text-soft)',
        'text-beige':  'var(--text-beige)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif:   ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        mono:    'var(--t-mono)',
        xs:      'var(--t-xs)',
        sm:      'var(--t-sm)',
        base:    'var(--t-base)',
        lg:      'var(--t-lg)',
        xl:      'var(--t-xl)',
        '2xl':   'var(--t-2xl)',
        '3xl':   'var(--t-3xl)',
        '4xl':   'var(--t-4xl)',
        '5xl':   'var(--t-5xl)',
        display: 'var(--t-display)',
      },
      animation: {
      'ember-pulse': 'ember-pulse 1.6s ease-in-out infinite',
    },
    keyframes: {
      'ember-pulse': {
        '0%,100%': { opacity: '1', boxShadow: '0 0 8px #c96e47'  },
        '50%':     { opacity: '.7', boxShadow: '0 0 18px #e8b196' },
      },
    },
    boxShadow: {
        '1':      'var(--shadow-1)',
        '2':      'var(--shadow-2)',
        '3':      'var(--shadow-3)',
        'maroon': 'var(--shadow-maroon)',
        'focus':  'var(--shadow-focus)',
      },
      borderRadius: {
        xs:   'var(--r-xs)',
        sm:   'var(--r-sm)',
        md:   'var(--r-md)',
        lg:   'var(--r-lg)',
        xl:   'var(--r-xl)',
        pill: 'var(--r-pill)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
    },
  },
  plugins: [],
};
