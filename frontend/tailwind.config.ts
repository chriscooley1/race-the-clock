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
        'hover-blue': '#1e90ff',
        'active-blue': '#0056b3',
        'theme-bg': 'var(--background-color)',
        'theme-text': 'var(--text-color)',
        'theme-display-bg': 'var(--display-background-color)',
        'theme-display-text': 'var(--display-text-color)',
        // Add more color options from your colorOptions array
        'bright-red': '#ff0000',
        'bright-orange': '#ff7f00',
        'bright-yellow': '#ffff00',
        'bright-green': '#00ff00',
        'bright-blue': '#0000ff',
        'bright-indigo': '#4b0082',
        'bright-violet': '#9400d3',
        'pastel-yellow': '#fdfd96',
        'hot-pink': '#ff69b4',
        'electric-purple': '#8a2be2',
        'teal': '#008080',
        'amber': '#ffc107',
        'slate': '#708090',
        'magenta': '#ff00ff',
        'lavender': '#e6e6fa',
        'mint': '#98ff98',
        'cyan': '#00ffff',
        'apricot': '#fbceb1',
        'jade': '#00a86b',
        'coral': '#ff6f61',
        'color-1': '#FF0000', // Red
        'color-2': '#00FF00', // Green
        'color-3': '#0000FF', // Blue
        'color-4': '#FFFF00', // Yellow
        'color-5': '#FF00FF', // Magenta
        'color-6': '#00FFFF', // Cyan
        'color-7': '#FFA500', // Orange
        'color-8': '#800080', // Purple
        'color-9': '#008000', // Dark Green
        'color-10': '#000080', // Navy Blue
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
      fontSize: {
        'vw-5': '5vw',
        'vw-7': '7vw',
        'vw-10': '10vw',
        'vw-15': '15vw',
        'vw-20': '20vw',
      },
      maxWidth: {
        'collection-setup': '600px',
      },
      minHeight: {
        'screen': '100vh',
      },
      borderWidth: {
        '5': '5px',
      },
      width: {
        'landing-button': '300px',
      },
      backgroundImage: {
        'theme-bg-image': 'var(--background-image)',
      },
    },
  },
  plugins: [],
}

export default config
