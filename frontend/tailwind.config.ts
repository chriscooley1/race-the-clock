import type { Config } from "tailwindcss"
import { colorSchemes } from "./src/constants/colorSchemes"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode
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
        ...Object.fromEntries(colorSchemes.map(scheme => [scheme.name.toLowerCase().replace(/\s+/g, '-'), scheme.backgroundColor])),
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
  safelist: [
    ...colorSchemes.map(scheme => `bg-[${scheme.backgroundColor}]`),
    ...colorSchemes.map(scheme => `text-[${scheme.textColor}]`),
  ],
  plugins: [],
}

export default config
