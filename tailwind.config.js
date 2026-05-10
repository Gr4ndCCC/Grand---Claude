/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* legacy tokens (kept) */
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

        /* v3 palette */
        black: '#0a0807',
        charcoal: {
          700: '#2a2520',
          800: '#201c18',
          900: '#1a1714',
          950: '#110f0d',
        },
        bone: {
          100: '#f5ede0',
          200: '#eadfca',
          300: '#d9c9ab',
          400: '#c2ad89',
          500: '#8e7a5e',
        },
        ember: {
          DEFAULT: '#b85332',
          hi:      '#d98d6a',
          cream:   '#ffc28a',
        },
        burgundy: {
          DEFAULT: '#800000',
          deep:    '#550000',
        },
        'gold-v3':    '#b8924a',
        'gold-hi-v3': '#d4a85f',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        serif:   ['Newsreader', 'Georgia', 'serif'],
        sans:    ['Newsreader', 'Georgia', 'serif'],
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
      transitionTimingFunction: {
        coal:  'cubic-bezier(0.4, 0, 0.2, 1)',
        spark: 'cubic-bezier(0.2, 0.9, 0.25, 1.2)',
        smoke: 'cubic-bezier(0.6, 0.04, 0.2, 1)',
      },
      animation: {
        'ember-pulse': 'ember-pulse 1.6s ease-in-out infinite',
        'flicker':     'flicker 2.6s var(--ease-coal) infinite',
        'firepulse':   'firepulse 5s var(--ease-coal) infinite',
        'shimmer':     'shimmer 7s ease infinite',
        'heatslide':   'heatslide 3s linear infinite',
        'rise':        'rise linear infinite',
        'pulse-dot':   'pulse-dot 1.6s var(--ease-coal) infinite',
        'vaultpulse':  'vaultpulse 6s var(--ease-coal) infinite',
        'grain':       'grain 8s steps(6) infinite',
        'heatdrift':   'heatdrift 14s var(--ease-smoke) infinite',
      },
      keyframes: {
        'ember-pulse': {
          '0%,100%': { opacity: '1', boxShadow: '0 0 8px #c96e47'  },
          '50%':     { opacity: '.7', boxShadow: '0 0 18px #e8b196' },
        },
        flicker: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)',     filter: 'brightness(1)'    },
          '35%':     { transform: 'scale(1.05) rotate(-1deg)', filter: 'brightness(1.15)' },
          '65%':     { transform: 'scale(.97) rotate(1deg)',   filter: 'brightness(.92)'  },
        },
        firepulse: {
          '0%,100%': { opacity: '1',   filter: 'brightness(1) saturate(1)' },
          '50%':     { opacity: '.92', filter: 'brightness(1.1) saturate(1.15)' },
        },
        shimmer: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%':     { transform: 'translateY(-8px) scale(1.04)' },
        },
        heatslide: {
          from: { backgroundPosition: '0% 50%' },
          to:   { backgroundPosition: '200% 50%' },
        },
        rise: {
          '0%':   { transform: 'translateY(0) translateX(0) scale(1)',     opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '.6' },
          '100%': { transform: 'translateY(-100vh) translateX(40px) scale(.3)', opacity: '0' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1',   transform: 'scale(1)'  },
          '50%':     { opacity: '.5',  transform: 'scale(.7)' },
        },
        vaultpulse: {
          '0%,100%': { opacity: '.6', transform: 'scale(1)'    },
          '50%':     { opacity: '1',  transform: 'scale(1.15)' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)'   },
          '20%':     { transform: 'translate(-2px,1px)'  },
          '40%':     { transform: 'translate(1px,-2px)'  },
          '60%':     { transform: 'translate(-1px,2px)'  },
          '80%':     { transform: 'translate(2px,1px)'   },
        },
        heatdrift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)',    opacity: '.9'  },
          '33%':     { transform: 'translate(40px,-30px) scale(1.05)', opacity: '1'   },
          '66%':     { transform: 'translate(-30px,20px) scale(.98)',  opacity: '.85' },
        },
      },
      boxShadow: {
        '1':      'var(--shadow-1)',
        '2':      'var(--shadow-2)',
        '3':      'var(--shadow-3)',
        'maroon': 'var(--shadow-maroon)',
        'ember':  'var(--shadow-ember)',
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
