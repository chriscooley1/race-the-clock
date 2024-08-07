import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of your theme
interface Theme {
  backgroundColor: string;
  color: string;
  className: string;
  textColor: string;
  [key: string]: string; // Allow for additional theme properties
}

// Define possible themes
const darkTheme: Theme = {
  backgroundColor: "#333",
  color: "#fff",
  className: "dark-theme",
  textColor: "#fff",
};

const blueTheme: Theme = {
  backgroundColor: "#cceeff",
  color: "#003366",
  className: "blue-theme",
  textColor: "#003366",
};

const lightTheme: Theme = {
  backgroundColor: "#fff",
  color: "#000",
  className: "light-theme",
  textColor: "#000",
};

// Additional fun and bright themes
const neonPinkTheme: Theme = {
  backgroundColor: "#ff69b4",
  color: "#000",
  className: "neon-pink-theme",
  textColor: "#000",
};

const neonGreenTheme: Theme = {
  backgroundColor: "#39ff14",
  color: "#000",
  className: "neon-green-theme",
  textColor: "#000",
};

const neonBlueTheme: Theme = {
  backgroundColor: "#1e90ff",
  color: "#fff",
  className: "neon-blue-theme",
  textColor: "#fff",
};

const neonOrangeTheme: Theme = {
  backgroundColor: "#ff4500",
  color: "#000",
  className: "neon-orange-theme",
  textColor: "#000",
};

// Rainbow color themes
const redTheme: Theme = {
  backgroundColor: "#ff0000",
  color: "#fff",
  className: "red-theme",
  textColor: "#fff",
};

const orangeTheme: Theme = {
  backgroundColor: "#ffa500",
  color: "#000",
  className: "orange-theme",
  textColor: "#000",
};

const yellowTheme: Theme = {
  backgroundColor: "#ffff00",
  color: "#000",
  className: "yellow-theme",
  textColor: "#000",
};

const greenTheme: Theme = {
  backgroundColor: "#008000",
  color: "#fff",
  className: "green-theme",
  textColor: "#fff",
};

const blueThemeColor: Theme = {
  backgroundColor: "#0000ff",
  color: "#fff",
  className: "blue-theme-color",
  textColor: "#fff",
};

const indigoTheme: Theme = {
  backgroundColor: "#4b0082",
  color: "#fff",
  className: "indigo-theme",
  textColor: "#fff",
};

const violetTheme: Theme = {
  backgroundColor: "#ee82ee",
  color: "#000",
  className: "violet-theme",
  textColor: "#000",
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
  // Retrieve the theme from localStorage or default to light theme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme ? JSON.parse(savedTheme) : lightTheme;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("app-theme", JSON.stringify(theme));
    
    // Update CSS variables based on the selected theme
    document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
    document.documentElement.style.setProperty("--text-color", theme.textColor);
    document.documentElement.style.setProperty("--color", theme.color);
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
