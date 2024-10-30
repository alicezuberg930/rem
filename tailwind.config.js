/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.css"
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-left': {
          '0%': {
            '-webkit-transform': 'translateX(500px);',
            transform: 'translateX(500px);'
          },
          '100%': {
            '-webkit-transform': 'translateX(0);',
            transform: 'translateX(0);'
          }
        },
        'slide-left-2': {
          '0%': {
            '-webkit-transform': 'translateX(500px);',
            transform: 'translateX(500px);'
          },
          '100%': {
            '-webkit-transform': 'translateX(0);',
            transform: 'translateX(0);'
          }
        },
      },
      animation: {
        'slide-left': 'slide-left 2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-left-2': 'slide-left-2 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      },
      transitionProperty: {
        'opacity-left': 'opacity, left', // Custom transition property
      },
      transitionDuration: {
        '1000': '1000ms', // Custom duration of 1s
      },
      transitionTimingFunction: {
        'ease': 'ease', // Custom timing function
      },
    },
  },
  plugins: [],
}

