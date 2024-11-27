/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html, ts, js}"],
  theme: {
    extend: {
      fontFamily: {
        'lato': ['lato', 'sans-serif'],
      },
      colors: {
        'default': 'rgb(24, 24, 24)',
        'onHover': 'rgb(29, 29, 29)'
      },
    },

  },
  plugins: [],
}

