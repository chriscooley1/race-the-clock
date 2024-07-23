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
  // Add additional dark theme properties here if needed
};

const blueTheme: Theme = {
  backgroundColor: "#cceeff",
  color: "#003366",
  className: "blue-theme",
  // Add additional blue theme properties here if needed
};

const lightTheme: Theme = {
  backgroundColor: "#fff",
  color: "#000",
  className: "light-theme",
  // Add additional light theme properties here if needed
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
  const [theme, setTheme] = useState<Theme>(lightTheme); // Default to light theme

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
export { darkTheme, blueTheme, lightTheme };
