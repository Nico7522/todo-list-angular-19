/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'media',
  content: ["./src/**/*.{html, ts, js}","./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      
      fontFamily: {
        'lato': ['lato', 'sans-serif'],
      },
      colors: {
        'default': 'rgb(24, 24, 24)',
        'onHover': 'rgb(29, 29, 29)'
      },
      screens: {
        'nav': '1400px'
      }
    },

  },
  plugins: [
    require('flowbite/plugin') // add this line
  ],
}

