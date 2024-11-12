export interface ColorScheme {
  name: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

// Define and export the color schemes
export const colorSchemes: ColorScheme[] = [
  { name: "Heisenberg Blue", backgroundColor: "#6fd7fe", textColor: "#333333" },
  { name: "Salmon Pink", backgroundColor: "#fa96a2", textColor: "#333333" },
  { name: "Alesan", backgroundColor: "#f0ccb2", textColor: "#333333" },
  { name: "Red Radish", backgroundColor: "#f63643", textColor: "#FFFFFF" },
  { name: "Oleander Pink", backgroundColor: "#fe609d", textColor: "#FFFFFF" },
  { name: "White", backgroundColor: "#FFFFFF", textColor: "#333333" },
  { name: "Hawkbit", backgroundColor: "#ffd86f", textColor: "#333333" },
  { name: "Middle Blue Purple", backgroundColor: "#8c6fbf", textColor: "#FFFFFF" },
  { name: "Jasmine Green", backgroundColor: "#8cca43", textColor: "#FFFFFF" },
  { name: "Gainsboro", backgroundColor: "#dcdcdc", textColor: "#333333" },
  { name: "Vibrant Orange", backgroundColor: "#ff7220", textColor: "#FFFFFF" },
  { name: "Black", backgroundColor: "#000000", textColor: "#FFFFFF" },
  // New color schemes from the image
  { name: "Bright Red", backgroundColor: "#FF5252", textColor: "#FFFFFF" },
  { name: "Sunny Yellow", backgroundColor: "#FFD740", textColor: "#333333" },
  { name: "Sky Blue", backgroundColor: "#40C4FF", textColor: "#333333" },
  { name: "Lime Green", backgroundColor: "#AEEA00", textColor: "#333333" },
  { name: "Hot Pink", backgroundColor: "#FF4081", textColor: "#FFFFFF" },
  { name: "Electric Purple", backgroundColor: "#7C4DFF", textColor: "#FFFFFF" },
  { name: "Tangerine", backgroundColor: "#FF6E40", textColor: "#333333" },
  { name: "Turquoise", backgroundColor: "#1DE9B6", textColor: "#333333" },
  { name: "Lavender", backgroundColor: "#B39DDB", textColor: "#333333" },
  { name: "Coral", backgroundColor: "#FF7043", textColor: "#333333" },
  { name: "Mint Green", backgroundColor: "#00E676", textColor: "#333333" },
  { name: "Bright Cyan", backgroundColor: "#18FFFF", textColor: "#333333" },
  { name: "Magenta", backgroundColor: "#E040FB", textColor: "#FFFFFF" },
];

export const collectionColorSchemes = colorSchemes.slice(2); // Exclude White and Black

export const appBackgroundColors = colorSchemes; // Use the full colorSchemes array instead of an empty object
