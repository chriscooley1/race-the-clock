import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your theme
interface Theme {
  backgroundColor: string;
  color: string;
  className: string; // Add a className property
  [key: string]: string; // Allow for additional theme properties
}

// Define possible themes
const darkTheme: Theme = {
  backgroundColor: "#333",
  color: "#fff",
  className: "dark-theme",
};

const blueTheme: Theme = {
  backgroundColor: "#cceeff",
  color: "#003366",
  className: "blue-theme",
};

const lightTheme: Theme = {
  backgroundColor: "#fff",
  color: "#000",
  className: "light-theme",
};

// Additional fun and bright themes
const neonPinkTheme: Theme = {
  backgroundColor: "#ff69b4",
  color: "#fff",
  className: "neon-pink-theme",
};

const neonGreenTheme: Theme = {
  backgroundColor: "#39ff14",
  color: "#000",
  className: "neon-green-theme",
};

const neonBlueTheme: Theme = {
  backgroundColor: "#1e90ff",
  color: "#fff",
  className: "neon-blue-theme",
};

const neonOrangeTheme: Theme = {
  backgroundColor: "#ff4500",
  color: "#fff",
  className: "neon-orange-theme",
};

// Rainbow color themes
const redTheme: Theme = {
  backgroundColor: "#ff0000",
  color: "#fff",
  className: "red-theme",
};

const orangeTheme: Theme = {
  backgroundColor: "#ffa500",
  color: "#000",
  className: "orange-theme",
};

const yellowTheme: Theme = {
  backgroundColor: "#ffff00",
  color: "#000",
  className: "yellow-theme",
};

const greenTheme: Theme = {
  backgroundColor: "#008000",
  color: "#fff",
  className: "green-theme",
};

const blueThemeColor: Theme = {
  backgroundColor: "#0000ff",
  color: "#fff",
  className: "blue-theme-color",
};

const indigoTheme: Theme = {
  backgroundColor: "#4b0082",
  color: "#fff",
  className: "indigo-theme",
};

const violetTheme: Theme = {
  backgroundColor: "#ee82ee",
  color: "#000",
  className: "violet-theme",
};

// Define the shape of the context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set the default theme
  const [theme, setTheme] = useState<Theme>(darkTheme); // Default to dark theme

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

// Export the predefined themes
export {
  darkTheme,
  blueTheme,
  lightTheme,
  neonPinkTheme,
  neonGreenTheme,
  neonBlueTheme,
  neonOrangeTheme,
  redTheme,
  orangeTheme,
  yellowTheme,
  greenTheme,
  blueThemeColor,
  indigoTheme,
  violetTheme
};
