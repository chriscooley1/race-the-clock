// colorSchemes.ts
export interface ColorScheme {
  name: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

// Define and export the color schemes
export const colorSchemes: ColorScheme[] = [
  {
    name: "White",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
  {
    name: "Black",
    backgroundColor: "#000000",
    textColor: "#ffffff",
  },
  {
    name: "Pastel",
    backgroundColor: "#fdfd96",
    textColor: "#034f84",
  },
  {
    name: "Ocean Waves",
    backgroundColor: "#2e8b57",
    textColor: "#f0f8ff",
    backgroundImage: "url('/images/ocean-waves.jpg')",
  },
  {
    name: "Sunny Meadow",
    backgroundColor: "#fff700",
    textColor: "#333333",
    backgroundImage: "url('/images/sunny-meadow.jpg')",
  },
  {
    name: "Bright Red",
    backgroundColor: "#ff0000",
    textColor: "#ffffff",
  },
  {
    name: "Bright Orange",
    backgroundColor: "#ff7f00",
    textColor: "#ffffff",
  },
  {
    name: "Bright Green",
    backgroundColor: "#00ff00",
    textColor: "#000000",
  },
  {
    name: "Bright Blue",
    backgroundColor: "#0000ff",
    textColor: "#ffffff",
  },
  {
    name: "Bright Indigo",
    backgroundColor: "#4b0082",
    textColor: "#ffffff",
  },
  {
    name: "Bright Violet",
    backgroundColor: "#9400d3",
    textColor: "#ffffff",
  },
  {
    name: "Sunshine",
    backgroundColor: "#fff700",
    textColor: "#333333",
  },
  {
    name: "Sky Blue",
    backgroundColor: "#87ceeb",
    textColor: "#000000",
  },
  {
    name: "Lime Green",
    backgroundColor: "#32cd32",
    textColor: "#000000",
  },
  {
    name: "Hot Pink",
    backgroundColor: "#ff69b4",
    textColor: "#000000",
  },
  {
    name: "Electric Purple",
    backgroundColor: "#8a2be2",
    textColor: "#ffffff",
  },
  {
    name: "Coral",
    backgroundColor: "#ff6f61",
    textColor: "#ffffff",
  },
  {
    name: "Teal",
    backgroundColor: "#008080",
    textColor: "#ffffff",
  },
  {
    name: "Amber",
    backgroundColor: "#ffc107",
    textColor: "#333333",
  },
  {
    name: "Slate",
    backgroundColor: "#708090",
    textColor: "#ffffff",
  },
  {
    name: "Magenta",
    backgroundColor: "#ff00ff",
    textColor: "#000000",
  },
  {
    name: "Lavender",
    backgroundColor: "#e6e6fa",
    textColor: "#4b0082",
  },
  {
    name: "Mint",
    backgroundColor: "#98ff98",
    textColor: "#2f4f4f",
  },
  {
    name: "Cyan",
    backgroundColor: "#00ffff",
    textColor: "#000000",
  },
  {
    name: "Apricot",
    backgroundColor: "#fbceb1",
    textColor: "#8b4513",
  },
  {
    name: "Jade",
    backgroundColor: "#00a86b",
    textColor: "#ffffff",
  },
];
