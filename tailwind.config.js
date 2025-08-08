import plugin from 'tailwindcss/plugin'
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [forms, 
            plugin(function ({ addUtilities }) {
                const weights = [100, 200, 300, 325, 400, 425, 475, 500, 525, 600, 700, 800, 900]

                const customWeights = Object.fromEntries(
                    weights.map(w => [`.fw-${w}`, { fontWeight: w }])
                )

                addUtilities(customWeights, ['responsive'])
            }),
    ],
}
