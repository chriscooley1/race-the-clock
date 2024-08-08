import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of your theme
interface Theme {
  backgroundColor: string;
  color: string;
  className: string;
  textColor: string;
  [key: string]: string; // Allow for additional theme properties
}

// Define standard themes
const lightTheme: Theme = {
  backgroundColor: "#ffffff",
  color: "#000000",
  className: "light-theme",
  textColor: "#000000",
};

const darkTheme: Theme = {
  backgroundColor: "#333333",
  color: "#ffffff",
  className: "dark-theme",
  textColor: "#ffffff",
};

// Pastel color themes
const pastelPinkTheme: Theme = {
  backgroundColor: "#ffccd5",
  color: "#000",
  className: "pastel-pink-theme",
  textColor: "#000",
};

const pastelGreenTheme: Theme = {
  backgroundColor: "#ccffcc",
  color: "#000",
  className: "pastel-green-theme",
  textColor: "#000",
};

const pastelBlueTheme: Theme = {
  backgroundColor: "#cce0ff",
  color: "#000",
  className: "pastel-blue-theme",
  textColor: "#000",
};

const pastelPurpleTheme: Theme = {
  backgroundColor: "#e0ccff",
  color: "#000",
  className: "pastel-purple-theme",
  textColor: "#000",
};

const pastelYellowTheme: Theme = {
  backgroundColor: "#fff9cc",
  color: "#000",
  className: "pastel-yellow-theme",
  textColor: "#000",
};

const pastelRedTheme: Theme = {
  backgroundColor: "#ffc1c1",
  color: "#000",
  className: "pastel-red-theme",
  textColor: "#000",
};

const pastelOrangeTheme: Theme = {
  backgroundColor: "#ffe0b3",
  color: "#000",
  className: "pastel-orange-theme",
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
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
    document.documentElement.style.setProperty(
      "--background-color",
      theme.backgroundColor
    );
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
  lightTheme,
  darkTheme,
  pastelPinkTheme,
  pastelGreenTheme,
  pastelBlueTheme,
  pastelPurpleTheme,
  pastelYellowTheme,
  pastelRedTheme,
  pastelOrangeTheme,
};
