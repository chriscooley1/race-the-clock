import type { Config } from "tailwindcss";
import { colorSchemes } from "./src/constants/colorSchemes";
import { lightenColor } from "./src/utils/colorUtils";

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
        Anakiwa: "#b0f2ff",
        "Hot Pink": "#ff7ab0",
        "Yellow Sea": "#fca409",
        "Bright Sun": "#ffdd3d",
        "Inch Worm": "#a8e30c",
        "Dodger Blue": "#1fc6ff",
        Lavender: "#ad7ade",
        "Coral Red": "#ff3442",
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
        hawkbit: "#ffd86f",
        "middle-blue-purple": "#8c6fbf",
        "jasmine-green": "#8cca43",
        gainsboro: "#dcdcdc",
        "vibrant-orange": "#ff7220",
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        caveat: "Caveat",
        "patrick-hand": "Patrick Hand",
        chewy: "Chewy",
        "comic-neue": "Comic Neue",
        "baloo-2": "Baloo 2",
        custom: ["KG What The Teacher Wants", "Comic Neue", "sans-serif"],
        teacher: ["KG What The Teacher Wants", "Comic Neue", "sans-serif"],
        "shake-it-off": ['"KG Shake It Off"', "Comic Neue", "sans-serif"],
        "happy-covers-regular": [
          "HappyCovers-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-covers-shadow-regular": [
          "HappyCoversShadow-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-fun-letters-regular": [
          "HappyFunLetters-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-fun-letters-titles-regular": [
          "HappyFunLettersTitles-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-fun-letters-titles-shadow-regular": [
          "HappyFunLettersTitlesShadow-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-letters-regular": [
          "HappyLetters-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-medium-regular": [
          "HappyMedium-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-medium-shadow-regular": [
          "HappyMediumShadow-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-neat-handwriting-regular": [
          "HappyNeatHandwriting-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-paragraphs-regular": [
          "HappyParagraphs-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-task-card-labels-regular": [
          "HappyTaskCardLabels-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        "happy-titles-regular": [
          "HappyTitles-Regular",
          "Comic Neue",
          "sans-serif",
        ],
        display: ["var(--display-font-family)"],
      },
      spacing: {
        navbar: "50px",
        "15": "3.75rem",
        "navbar-height": "200px",
        "collections-navbar-height": "64px",
        "total-navbar-height": "264px",
        "content-padding": "200px",
        "content-padding-with-collections": "260px",
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
    ...colorSchemes.map(
      (scheme) => `bg-[${lightenColor(scheme.backgroundColor, 0.7)}]`,
    ),
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
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "hover:bg-blue-500",
    "hover:bg-green-500",
    "hover:bg-purple-500",
    "hover:bg-yellow-500",
    "hover:bg-red-500",
    "dark:hover:bg-blue-500",
    "dark:hover:bg-green-500",
    "dark:hover:bg-purple-500",
    "dark:hover:bg-yellow-500",
    "dark:hover:bg-red-500",
    "font-display",
    "font-happy-covers-regular",
    "font-happy-covers-shadow-regular",
    "font-happy-fun-letters-regular",
    "font-happy-fun-letters-titles-regular",
    "font-happy-fun-letters-titles-shadow-regular",
    "font-happy-letters-regular",
    "font-happy-medium-regular",
    "font-happy-medium-shadow-regular",
    "font-happy-neat-handwriting-regular",
    "font-happy-paragraphs-regular",
    "font-happy-task-card-labels-regular",
    "font-happy-titles-regular",
  ],
  plugins: [],
};

export default config;
