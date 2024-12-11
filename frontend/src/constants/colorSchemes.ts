export interface ColorScheme {
  name: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

// Define and export the color schemes
export const colorSchemes: ColorScheme[] = [
  // Primary color schemes
  { name: "Anakiwa", backgroundColor: "#b0f2ff", textColor: "#333333" },
  { name: "Hot Pink", backgroundColor: "#ff7ab0", textColor: "#FFFFFF" },
  { name: "Yellow Sea", backgroundColor: "#fca409", textColor: "#333333" },
  { name: "Bright Sun", backgroundColor: "#ffdd3d", textColor: "#333333" },
  { name: "Inch Worm", backgroundColor: "#a8e30c", textColor: "#333333" },
  { name: "Dodger Blue", backgroundColor: "#1fc6ff", textColor: "#333333" },
  { name: "Lavender", backgroundColor: "#ad7ade", textColor: "#FFFFFF" },
  { name: "Coral Red", backgroundColor: "#ff3442", textColor: "#FFFFFF" },
  // Old color schemes (reordered)
  { name: "Oleander Pink", backgroundColor: "#fe609d", textColor: "#FFFFFF" },
  { name: "Vibrant Orange", backgroundColor: "#ff7220", textColor: "#FFFFFF" },
  { name: "Hawkbit", backgroundColor: "#ffd86f", textColor: "#333333" },
  { name: "Jasmine Green", backgroundColor: "#8cca43", textColor: "#FFFFFF" },
  { name: "Heisenberg Blue", backgroundColor: "#6fd7fe", textColor: "#333333" },
  {
    name: "Middle Blue Purple",
    backgroundColor: "#8c6fbf",
    textColor: "#FFFFFF",
  },
  { name: "Red Radish", backgroundColor: "#f63643", textColor: "#FFFFFF" },
  // { name: "Salmon Pink", backgroundColor: "#fa96a2", textColor: "#333333" },
  // { name: "Alesan", backgroundColor: "#f0ccb2", textColor: "#333333" },
  // { name: "Gainsboro", backgroundColor: "#dcdcdc", textColor: "#333333" },
  // New color schemes (reordered)
  { name: "Wild Strawberry", backgroundColor: "#FF4081", textColor: "#FFFFFF" },
  { name: "Tangerine", backgroundColor: "#FF6E40", textColor: "#333333" },
  { name: "Sunny Yellow", backgroundColor: "#FFD740", textColor: "#333333" },
  { name: "Lime Green", backgroundColor: "#AEEA00", textColor: "#333333" },
  { name: "Sky Blue", backgroundColor: "#40C4FF", textColor: "#333333" },
  { name: "Electric Purple", backgroundColor: "#7C4DFF", textColor: "#FFFFFF" },
  { name: "Magenta", backgroundColor: "#E040FB", textColor: "#FFFFFF" },
  { name: "Turquoise", backgroundColor: "#1DE9B6", textColor: "#333333" },
  { name: "Bright Cyan", backgroundColor: "#18FFFF", textColor: "#333333" },
  { name: "Cold Purple", backgroundColor: "#B39DDB", textColor: "#333333" },
  { name: "Mint Green", backgroundColor: "#00E676", textColor: "#333333" },
  // Neutral color schemes
  { name: "White", backgroundColor: "#FFFFFF", textColor: "#333333" },
  { name: "Black", backgroundColor: "#000000", textColor: "#FFFFFF" },
];

export const collectionColorSchemes = colorSchemes.filter(
  (scheme) => scheme.name !== "Black" && scheme.name !== "White",
);

export const appBackgroundColors = colorSchemes; // Use the full colorSchemes array instead of an empty object
