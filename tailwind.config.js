/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ember:        'var(--ember)',
        'ember-hot':  'var(--ember-hot)',
        'ember-deep': 'var(--ember-deep)',
        maroon:       'var(--maroon)',
        'maroon-deep':'var(--maroon-deep)',

        'char-0': 'var(--char-0)',
        'char-1': 'var(--char-1)',
        'char-2': 'var(--char-2)',
        'char-3': 'var(--char-3)',
        'char-4': 'var(--char-4)',
        'char-5': 'var(--char-5)',
        'ash-1':  'var(--ash-1)',
        'ash-2':  'var(--ash-2)',
        paper:    'var(--paper)',

        surface:         'var(--surface)',
        'surface-raised':'var(--surface-raised)',
        'surface-sunk':  'var(--surface-sunk)',
        'surface-deep':  'var(--surface-deep)',

        ink:           'var(--ink)',
        'ink-mid':     'var(--ink-mid)',
        'ink-soft':    'var(--ink-soft)',
        'ink-inverse': 'var(--ink-inverse)',

        line:          'var(--line)',
        'line-soft':   'var(--line-soft)',
        'line-strong': 'var(--line-strong)',
      },
      fontFamily: {
        display: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        serif:   ['Newsreader', 'Georgia', 'serif'],
        sans:    ['Newsreader', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'mono':    'var(--t-mono)',
        'xs':      'var(--t-xs)',
        'sm':      'var(--t-sm)',
        'base':    'var(--t-base)',
        'lg':      'var(--t-lg)',
        'xl':      'var(--t-xl)',
        '2xl':     'var(--t-2xl)',
        '3xl':     'var(--t-3xl)',
        '4xl':     'var(--t-4xl)',
        '5xl':     'var(--t-5xl)',
        'display': 'var(--t-display)',
      },
      transitionTimingFunction: {
        spark: 'cubic-bezier(0.22, 1, 0.36, 1)',
        flame: 'cubic-bezier(0.4, 0, 0.2, 1)',
        smoke: 'cubic-bezier(0.6, 0.05, 0.4, 1)',
      },
      boxShadow: {
        '1':     'var(--shadow-1)',
        '2':     'var(--shadow-2)',
        '3':     'var(--shadow-3)',
        'ember': 'var(--shadow-ember)',
        'focus': 'var(--shadow-focus)',
      },
      borderRadius: {
        'xs':   'var(--r-xs)',
        'sm':   'var(--r-sm)',
        'md':   'var(--r-md)',
        'lg':   'var(--r-lg)',
        'xl':   'var(--r-xl)',
        'pill': 'var(--r-pill)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
    },
  },
  plugins: [],
};
