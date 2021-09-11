module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/**/*.html',
      './src/**/*.tsx',
      './src/**/*.jsx',
    ],
  },
  darkMode: false,
  theme: {
    minHeight: {
      '14': '4rem',
    },
    extend: {
      colors: {
        primary: '#5c9ce9',
        secondary: '#9a97ef',
        neutral: '#6b7280',
        danger: '#dc2626',
        none: '#f3f4f6',
        gallery: '#799dbe',
        performance: '#fbcfe8',
        film: '#fcba6c',
        health: '#95c6a1',
        party: '#9f4963',
        market: '#fcd34d',
        workshop: '#896bbc',
        other: '#6b7280',
      },
      height: {
        'screen-nav': 'calc(100vh - 4rem)',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
