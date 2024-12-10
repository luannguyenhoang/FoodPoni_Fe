/** @type {import('tailwindcss').Config} */
const { breakpoints } = require('./styles/breakpoints.ts');

module.exports = {
  content: ['./index.d.ts.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        'primary': '#F36F24',
      },
      fontFamily: {
        'sans': ['Nunito', 'sans-serif']
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
