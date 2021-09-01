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
      height: {
        'screen-nav': 'calc(100vh - 4rem)',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
