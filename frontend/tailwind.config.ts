import type { Config } from "tailwindcss";
import { colorSchemes } from "./src/constants/colorSchemes";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        "light-blue": "#cceeff",
        "light-pink": "#ffe4e1",
        "custom-green": {
          DEFAULT: "#4caf50",
          dark: "#45a049",
          darker: "#388e3c",
        },
        "custom-red": {
          DEFAULT: "#ff6666",
          dark: "#cc0000",
          darker: "#990000",
        },
        "custom-blue": {
          DEFAULT: "#0275d8",
          dark: "#025aa5",
          darker: "#014f86",
        },
        "hover-blue": "#1e90ff",
        "active-blue": "#0056b3",
        "theme-bg": "var(--background-color, #FFFFFF)",
        "theme-text": "var(--text-color, #000000)",
        "theme-display-bg": "var(--display-background-color, #FFFFFF)",
        "theme-display-text": "var(--display-text-color, #000000)",
        // Dynamically add colors from colorSchemes
        ...Object.fromEntries(
          colorSchemes.map((scheme) => [
            scheme.name.toLowerCase().replace(/\s+/g, "-"),
            scheme.backgroundColor,
          ]),
        ),
        // Add text colors as well
        ...Object.fromEntries(
          colorSchemes.map((scheme) => [
            `text-${scheme.name.toLowerCase().replace(/\s+/g, "-")}`,
            scheme.textColor,
          ]),
        ),
        "sunny-yellow": "#FFD740",
        "sky-blue": "#40C4FF",
        "lime-green": "#AEEA00",
        "hot-pink": "#FF4081",
        "electric-purple": "#7C4DFF",
        tangerine: "#FF6E40",
        turquoise: "#1DE9B6",
        lavender: "#B39DDB",
        "mint-green": "#00E676",
        "bright-cyan": "#18FFFF",
        magenta: "#E040FB",
        "heisenberg-blue": "#6fd7fe",
        "salmon-pink": "#fa96a2",
        alesan: "#f0ccb2",
        "alesan-light": "#f5d1c2",
        "red-radish": "#f63643",
        "oleander-pink": "#fe609d",
        white: "#FFFFFF",
        hawkbit: "#ffd86f",
        "middle-blue-purple": "#8c6fbf",
        "jasmine-green": "#8cca43",
        gainsboro: "#dcdcdc",
        "vibrant-orange": "#ff7220",
        black: "#000000",
      },
      fontFamily: {
        caveat: "Caveat",
        "patrick-hand": "Patrick Hand",
        chewy: "Chewy",
        "comic-neue": "Comic Neue",
        "baloo-2": "Baloo 2",
        custom: "var(--font-family, 'Comic Neue', sans-serif)",
        teacher: ['"KG What The Teacher Wants"', 'Comic Neue', 'sans-serif'],
        "shake-it-off": ['"KG Shake It Off"', 'Comic Neue', 'sans-serif'],
      },
      spacing: {
        sidebar: "250px",
        navbar: "50px",
        "15": "3.75rem",
      },
      zIndex: {
        modal: "1000",
      },
      transitionProperty: {
        "background-transform": "background-color, transform",
      },
      fontSize: {
        "vw-5": "5vw",
        "vw-7": "7vw",
        "vw-10": "10vw",
        "vw-15": "15vw",
        "vw-20": "20vw",
        "3xl": "3em",
      },
      maxWidth: {
        "collection-setup": "600px",
      },
      minHeight: {
        screen: "100vh",
      },
      borderWidth: {
        "5": "5px",
      },
      width: {
        "landing-button": "300px",
      },
      backgroundImage: {
        "theme-bg-image": "var(--background-image)",
      },
    },
  },
  safelist: [
    ...colorSchemes.map((scheme) => `bg-[${scheme.backgroundColor}]`),
    ...colorSchemes.map((scheme) => `text-[${scheme.textColor}]`),
    // Add the custom classes to the safelist
    "font-teacher",
    "bg-light-blue",
    "bg-custom-red",
    "hover:bg-custom-red-dark",
    "bg-custom-green",
    "hover:bg-custom-green-dark",
    "hover:text-hover-blue",
    "bg-light-pink",
    "bg-theme-bg",
    "text-theme-text",
    "active:bg-active-blue",
    "w-15",
    "h-15",
    "transition-background-transform",
    "border-5",
    "fullscreen",
    "dark",
    "main-content-area",
    "font-shake-it-off",
  ],
  plugins: [],
};

export default config;
