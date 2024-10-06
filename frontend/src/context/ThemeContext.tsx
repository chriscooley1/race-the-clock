import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { adjustColorForColorblindness } from "../utils/colorAdjustment";
import { colorSchemes } from "../constants/colorSchemes";

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  className?: string;
  displayTextColor?: string;
  displayBackgroundColor?: string;
  backgroundImage?: string;
  isColorblindMode: boolean;
  colorblindType: string;
  isDarkMode: boolean;
  font: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setDisplayTextColor: (color: string) => void;
  setDisplayBackgroundColor: (color: string) => void;
  setColorblindMode: (isEnabled: boolean) => void;
  setColorblindType: (type: string) => void;
  toggleDarkMode: () => void;
  adjustColorForColorblindness: (color: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme
      ? JSON.parse(savedTheme)
      : {
          ...colorSchemes[0],
          isColorblindMode: false,
          colorblindType: "",
          displayTextColor: undefined,
          displayBackgroundColor: undefined,
          isDarkMode: false,
          font: "Comic Neue",
          backgroundImage: "none",
        };
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  const setDisplayTextColor = (color: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, displayTextColor: color }));
  };

  const setDisplayBackgroundColor = (color: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, displayBackgroundColor: color }));
  };

  const setColorblindMode = (isEnabled: boolean) => {
    setTheme((prevTheme) => ({ ...prevTheme, isColorblindMode: isEnabled }));
  };

  const setColorblindType = (type: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, colorblindType: type }));
  };

  const toggleDarkMode = () => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      isDarkMode: !prevTheme.isDarkMode,
    }));
  };

  useEffect(() => {
    localStorage.setItem("app-theme", JSON.stringify(theme));

    const backgroundColor = theme.backgroundColor;
    const backgroundImage = theme.backgroundImage || "none"; // Make sure this is set to a valid CSS URL
    const textColor = theme.textColor;
    const displayTextColor = theme.displayTextColor || theme.textColor;
    const displayBackgroundColor =
      theme.displayBackgroundColor || theme.backgroundColor;

    if (theme.isColorblindMode && theme.colorblindType) {
      const adjustedBackgroundColor = adjustColorForColorblindness(
        backgroundColor,
        theme.colorblindType,
      );
      const adjustedTextColor = adjustColorForColorblindness(
        textColor,
        theme.colorblindType,
      );
      const adjustedDisplayTextColor = adjustColorForColorblindness(
        displayTextColor,
        theme.colorblindType,
      );
      const adjustedDisplayBackgroundColor = adjustColorForColorblindness(
        displayBackgroundColor,
        theme.colorblindType,
      );

      document.documentElement.style.setProperty(
        "--background-color",
        adjustedBackgroundColor,
      );
      document.documentElement.style.setProperty(
        "--text-color",
        adjustedTextColor,
      );
      document.documentElement.style.setProperty(
        "--display-text-color",
        adjustedDisplayTextColor,
      );
      document.documentElement.style.setProperty(
        "--display-background-color",
        adjustedDisplayBackgroundColor,
      );
    } else {
      document.documentElement.style.setProperty(
        "--background-color",
        backgroundColor,
      );
      document.documentElement.style.setProperty("--text-color", textColor);
      document.documentElement.style.setProperty(
        "--display-text-color",
        displayTextColor,
      );
      document.documentElement.style.setProperty(
        "--display-background-color",
        displayBackgroundColor,
      );
    }

    // Ensure that the URL is wrapped in a proper CSS function
    if (backgroundImage !== "none") {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${backgroundImage})`,
      );
    } else {
      document.documentElement.style.setProperty("--background-image", "none");
    }

    if (theme.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.style.setProperty("--font-family", theme.font);
    document.documentElement.style.setProperty(
      "--background-image",
      `url(${theme.backgroundImage})`,
    );
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setDisplayTextColor,
        setDisplayBackgroundColor,
        setColorblindMode,
        setColorblindType,
        toggleDarkMode,
        adjustColorForColorblindness: (color: string) =>
          adjustColorForColorblindness(color, theme.colorblindType),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
