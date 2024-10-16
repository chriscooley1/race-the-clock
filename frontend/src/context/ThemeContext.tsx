import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { adjustColorForColorblindness } from "../utils/colorAdjustment";
import { colorSchemes } from "../constants/colorSchemes";
import { darkenColor, lightenColor } from "../utils/colorUtils";

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
  setTheme: Dispatch<SetStateAction<Theme>>;
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
    setTheme((prevTheme) => {
      const newIsDarkMode = !prevTheme.isDarkMode;
      return {
        ...prevTheme,
        isDarkMode: newIsDarkMode,
        backgroundColor: newIsDarkMode ? darkenColor(prevTheme.backgroundColor, 0.5) : lightenColor(prevTheme.backgroundColor, 0.5),
        textColor: newIsDarkMode ? lightenColor(prevTheme.textColor, 0.5) : darkenColor(prevTheme.textColor, 0.5),
        displayBackgroundColor: newIsDarkMode ? darkenColor(prevTheme.displayBackgroundColor || prevTheme.backgroundColor, 0.5) : lightenColor(prevTheme.displayBackgroundColor || prevTheme.backgroundColor, 0.5),
        displayTextColor: newIsDarkMode ? lightenColor(prevTheme.displayTextColor || prevTheme.textColor, 0.5) : darkenColor(prevTheme.displayTextColor || prevTheme.textColor, 0.5),
      };
    });
  };

  useEffect(() => {
    localStorage.setItem("app-theme", JSON.stringify(theme));

    const applyColor = (color: string) => {
      let adjustedColor = color;
      if (theme.isColorblindMode && theme.colorblindType) {
        adjustedColor = adjustColorForColorblindness(adjustedColor, theme.colorblindType);
      }
      if (theme.isDarkMode) {
        adjustedColor = darkenColor(adjustedColor, 0.3);
      }
      return adjustedColor;
    };

    const backgroundColor = applyColor(theme.backgroundColor);
    const textColor = applyColor(theme.textColor);
    const displayTextColor = applyColor(theme.displayTextColor || theme.textColor);
    const displayBackgroundColor = applyColor(theme.displayBackgroundColor || theme.backgroundColor);

    document.documentElement.style.setProperty("--background-color", backgroundColor);
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--display-text-color", displayTextColor);
    document.documentElement.style.setProperty("--display-background-color", displayBackgroundColor);

    if (theme.backgroundImage && theme.backgroundImage !== "none") {
      document.documentElement.style.setProperty("--background-image", `url(${theme.backgroundImage})`);
    } else {
      document.documentElement.style.setProperty("--background-image", "none");
    }

    if (theme.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.style.setProperty("--font-family", theme.font);
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
