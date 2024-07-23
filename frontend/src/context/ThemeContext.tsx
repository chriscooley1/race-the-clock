import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your theme
interface Theme {
  backgroundColor: string;
  color: string;
  [key: string]: string; // Allow for additional theme properties
}

// Define possible themes
const darkTheme: Theme = {
  backgroundColor: '#333',
  color: '#fff',
};

const blueTheme: Theme = {
  backgroundColor: '#cceeff',
  color: '#003366',
};

const lightTheme: Theme = {
  backgroundColor: '#fff',
  color: '#000',
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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the predefined themes
export { darkTheme, blueTheme, lightTheme };
