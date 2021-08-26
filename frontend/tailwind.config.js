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
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
