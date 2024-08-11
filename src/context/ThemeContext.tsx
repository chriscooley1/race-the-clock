import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define color schemes with complementary background and text colors
export const colorSchemes = [
  {
    name: "Light",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
  {
    name: "Dark",
    backgroundColor: "#000000",
    textColor: "#ffffff",
  },
  {
    name: "Pastel",
    backgroundColor: "#fdfd96",
    textColor: "#034f84",
  },
  {
    name: "Ocean",
    backgroundColor: "#2e8b57",
    textColor: "#f0f8ff",
  },
  // Rainbow-inspired and bright color schemes
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
    name: "Bright Yellow",
    backgroundColor: "#ffff00",
    textColor: "#000000",
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
  // Additional color schemes with varied text colors
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

// Define the shape of your theme
interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  className?: string; // Optional if you still need it for styling
}

// Define the shape of the context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Retrieve the theme from localStorage or default to the first color scheme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme ? JSON.parse(savedTheme) : colorSchemes[0]; // Default to the first color scheme
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("app-theme", JSON.stringify(theme));

    // Update CSS variables based on the selected theme
    document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
    document.documentElement.style.setProperty("--text-color", theme.textColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
