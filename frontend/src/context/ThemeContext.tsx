import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { adjustColorForColorblindness as adjustColor } from "../utils/colorAdjustment";
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
  headingFont: string;
  buttonFont: string;
  adjustColorForColorblindness: (color: string) => string;
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
  setFont: (font: string) => void;
  setHeadingFont: (font: string) => void;
  setButtonFont: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const applyColorAdjustments = (currentTheme: Theme): Theme => {
    const adjustThemeColor = (color: string | undefined): string => {
      if (!color) return "";
      let adjustedColor = color;
      if (currentTheme.isColorblindMode && currentTheme.colorblindType) {
        adjustedColor = adjustColor(adjustedColor, currentTheme.colorblindType);
      }
      if (currentTheme.isDarkMode) {
        adjustedColor = darkenColor(adjustedColor, 0.3);
      }
      return adjustedColor;
    };

    return {
      ...currentTheme,
      backgroundColor: adjustThemeColor(currentTheme.backgroundColor),
      textColor: adjustThemeColor(currentTheme.textColor),
      displayBackgroundColor: adjustThemeColor(
        currentTheme.displayBackgroundColor || currentTheme.backgroundColor,
      ),
      displayTextColor: adjustThemeColor(
        currentTheme.displayTextColor || currentTheme.textColor,
      ),
    };
  };

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
          headingFont: "Chewy",
          buttonFont: "Patrick Hand",
          backgroundImage: "none",
          adjustColorForColorblindness: (color: string) => color,
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
    setTheme((prevTheme) => {
      const updatedTheme = { ...prevTheme, isColorblindMode: isEnabled };
      // Re-apply color adjustments when toggling colorblind mode
      return applyColorAdjustments(updatedTheme);
    });
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
        backgroundColor: newIsDarkMode
          ? darkenColor(prevTheme.backgroundColor, 0.5)
          : lightenColor(prevTheme.backgroundColor, 0.5),
        textColor: newIsDarkMode
          ? lightenColor(prevTheme.textColor, 0.5)
          : darkenColor(prevTheme.textColor, 0.5),
        displayBackgroundColor: newIsDarkMode
          ? darkenColor(
              prevTheme.displayBackgroundColor || prevTheme.backgroundColor,
              0.5,
            )
          : lightenColor(
              prevTheme.displayBackgroundColor || prevTheme.backgroundColor,
              0.5,
            ),
        displayTextColor: newIsDarkMode
          ? lightenColor(prevTheme.displayTextColor || prevTheme.textColor, 0.5)
          : darkenColor(prevTheme.displayTextColor || prevTheme.textColor, 0.5),
      };
    });
  };

  const setFont = (font: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, font }));
  };

  const setHeadingFont = (font: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, headingFont: font }));
  };

  const setButtonFont = (font: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, buttonFont: font }));
  };

  useEffect(() => {
    console.log("Applying theme:", theme);

    localStorage.setItem("app-theme", JSON.stringify(theme));

    const adjustedTheme = applyColorAdjustments(theme);

    if (theme.backgroundImage && theme.backgroundImage !== "none") {
      console.log("Setting background image:", theme.backgroundImage);
      const img = new Image();
      img.onload = () => console.log("Background image loaded successfully");
      img.onerror = (e) => {
        console.error("Failed to load background image", e);
        console.error("Image src:", theme.backgroundImage);
      };
      const imagePath = theme.backgroundImage.startsWith("/")
        ? theme.backgroundImage
        : `/${theme.backgroundImage}`;
      img.src = imagePath;
      document.body.style.backgroundImage = `url(${imagePath})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundColor = "transparent";
    } else {
      console.log("Removing background image");
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = theme.backgroundColor;
    }

    document.documentElement.style.setProperty(
      "--text-color",
      adjustedTheme.textColor ?? "",
    );
    document.documentElement.style.setProperty(
      "--display-text-color",
      adjustedTheme.displayTextColor ?? "",
    );
    document.documentElement.style.setProperty(
      "--display-background-color",
      adjustedTheme.displayBackgroundColor ?? "",
    );

    if (theme.backgroundImage && theme.backgroundImage !== "none") {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${theme.backgroundImage})`,
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
      "--heading-font-family",
      theme.headingFont,
    );
    document.documentElement.style.setProperty(
      "--button-font-family",
      theme.buttonFont,
    );

    console.log("Theme applied");
  }, [theme]);

  const themeContextValue: ThemeContextType = {
    theme,
    setTheme,
    setDisplayTextColor,
    setDisplayBackgroundColor,
    setColorblindMode,
    setColorblindType,
    toggleDarkMode,
    adjustColorForColorblindness: (color: string) =>
      theme.isColorblindMode ? adjustColor(color, theme.colorblindType) : color,
    setFont,
    setHeadingFont,
    setButtonFont,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
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
