import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your theme
interface Theme {
  backgroundColor: string;
  color: string;
  className: string; 
  textColor: string;  // Add a textColor property
  [key: string]: string; // Allow for additional theme properties
}

// Define possible themes
const darkTheme: Theme = {
  backgroundColor: "#333",
  color: "#fff",
  className: "dark-theme",
  textColor: "#fff", // Default text color for dark theme
};

const blueTheme: Theme = {
  backgroundColor: "#cceeff",
  color: "#003366",
  className: "blue-theme",
  textColor: "#003366", // Default text color for blue theme
};

const lightTheme: Theme = {
  backgroundColor: "#fff",
  color: "#000",
  className: "light-theme",
  textColor: "#000", // Default text color for light theme
};

// Additional fun and bright themes
const neonPinkTheme: Theme = {
  backgroundColor: "#ff69b4",
  color: "#fff",
  className: "neon-pink-theme",
  textColor: "#fff", // Default text color for neon pink theme
};

const neonGreenTheme: Theme = {
  backgroundColor: "#39ff14",
  color: "#000",
  className: "neon-green-theme",
  textColor: "#000", // Default text color for neon green theme
};

const neonBlueTheme: Theme = {
  backgroundColor: "#1e90ff",
  color: "#fff",
  className: "neon-blue-theme",
  textColor: "#fff", // Default text color for neon blue theme
};

const neonOrangeTheme: Theme = {
  backgroundColor: "#ff4500",
  color: "#fff",
  className: "neon-orange-theme",
  textColor: "#fff", // Default text color for neon orange theme
};

// Rainbow color themes
const redTheme: Theme = {
  backgroundColor: "#ff0000",
  color: "#fff",
  className: "red-theme",
  textColor: "#fff", // Default text color for red theme
};

const orangeTheme: Theme = {
  backgroundColor: "#ffa500",
  color: "#000",
  className: "orange-theme",
  textColor: "#000", // Default text color for orange theme
};

const yellowTheme: Theme = {
  backgroundColor: "#ffff00",
  color: "#000",
  className: "yellow-theme",
  textColor: "#000", // Default text color for yellow theme
};

const greenTheme: Theme = {
  backgroundColor: "#008000",
  color: "#fff",
  className: "green-theme",
  textColor: "#fff", // Default text color for green theme
};

const blueThemeColor: Theme = {
  backgroundColor: "#0000ff",
  color: "#fff",
  className: "blue-theme-color",
  textColor: "#fff", // Default text color for blue theme color
};

const indigoTheme: Theme = {
  backgroundColor: "#4b0082",
  color: "#fff",
  className: "indigo-theme",
  textColor: "#fff", // Default text color for indigo theme
};

const violetTheme: Theme = {
  backgroundColor: "#ee82ee",
  color: "#000",
  className: "violet-theme",
  textColor: "#000", // Default text color for violet theme
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
