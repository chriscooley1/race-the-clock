import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of your theme
interface Theme {
  name: string;
  backgroundColor: string;
  color: string;
  className: string;
  textColor: string;
}

// Predefined themes
const themes: Theme[] = [
  {
    name: "Light Mode",
    className: "light-theme",
    backgroundColor: "#ffffff",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Dark Mode",
    className: "dark-theme",
    backgroundColor: "#333333",
    color: "#ffffff",
    textColor: "#ffffff",
  },
  {
    name: "Pastel Pink",
    className: "pastel-pink-theme",
    backgroundColor: "#ffccd5",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Green",
    className: "pastel-green-theme",
    backgroundColor: "#ccffcc",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Blue",
    className: "pastel-blue-theme",
    backgroundColor: "#cce0ff",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Purple",
    className: "pastel-purple-theme",
    backgroundColor: "#e0ccff",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Yellow",
    className: "pastel-yellow-theme",
    backgroundColor: "#fff9cc",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Red",
    className: "pastel-red-theme",
    backgroundColor: "#ffc1c1",
    color: "#000000",
    textColor: "#000000",
  },
  {
    name: "Pastel Orange",
    className: "pastel-orange-theme",
    backgroundColor: "#ffe0b3",
    color: "#000000",
    textColor: "#000000",
  },
];

// Text color options
const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Pastel Pink", value: "#ffccd5" },
  { label: "Pastel Green", value: "#ccffcc" },
  { label: "Pastel Blue", value: "#cce0ff" },
  { label: "Pastel Purple", value: "#e0ccff" },
  { label: "Pastel Yellow", value: "#fff9cc" },
  { label: "Pastel Red", value: "#ffc1c1" },
  { label: "Pastel Orange", value: "#ffe0b3" },
];

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
    return savedTheme ? JSON.parse(savedTheme) : themes[0]; // Default to Light Mode
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

// Export the predefined themes and text color options
export { themes, textColorOptions };
