import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#cceeff',
        'light-pink': '#ffe4e1',
        'custom-green': {
          DEFAULT: '#4caf50',
          dark: '#45a049',
          darker: '#388e3c',
        },
        'custom-red': {
          DEFAULT: '#ff6666',
          dark: '#cc0000',
          darker: '#990000',
        },
        'custom-blue': {
          DEFAULT: '#0275d8',
          dark: '#025aa5',
          darker: '#014f86',
        },
      },
      fontFamily: {
        'caveat': ['Caveat', 'cursive'],
        'patrick-hand': ['"Patrick Hand"', 'cursive'],
      },
      spacing: {
        'sidebar': '250px',
        'navbar': '50px',
      },
      zIndex: {
        'modal': '1000',
      },
      transitionProperty: {
        'background-transform': 'background-color, transform',
      },
    },
  },
  plugins: [],
}

export default config
