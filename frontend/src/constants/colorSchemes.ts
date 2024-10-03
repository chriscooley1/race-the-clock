export interface ColorScheme {
  name: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

// Define and export the color schemes
export const colorSchemes: ColorScheme[] = [
  { name: "White", backgroundColor: "#FFFFFF", textColor: "#333333" },
  { name: "Black", backgroundColor: "#000000", textColor: "#FFFFFF" },
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

export const appBackgroundColors = {
  // Define your app background colors here
};
