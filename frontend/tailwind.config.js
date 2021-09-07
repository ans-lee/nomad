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
        primary: '#ec4899',
        secondary: '#6366f1',
        neutral: '#6b7280',
        danger: '#dc2626',
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
