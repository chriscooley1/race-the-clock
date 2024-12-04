import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { adjustColorForColorblindness as adjustColor } from "../utils/colorAdjustment";
import { colorSchemes } from "../constants/colorSchemes";
import { darkenColor, lightenColor } from "../utils/colorUtils";

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  originalTextColor: string; // Store original text color
  originalBackgroundColor: string; // Store original background color
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
  updateTheme: (newTheme: Theme) => void;
  setDisplayTextColor: (color: string) => void;
  setDisplayBackgroundColor: (color: string) => void;
  setColorblindMode: (isEnabled: boolean) => void;
  setColorblindType: (type: string) => void;
  toggleDarkMode: () => void;
  adjustColorForColorblindness: (color: string) => string;
  setFont: (font: string) => void;
  setHeadingFont: (font: string) => void;
  setButtonFont: (font: string) => void;
  setMainTextColor: (color: string) => void;
}

// Move the function outside of the ThemeProvider
export const setThemeWithColorAdjustment = (newTheme: Theme) => {
  // Set text color based on the current mode
  const textColor = newTheme.isDarkMode ? "#FFFFFF" : "#000000";

  return {
    ...newTheme,
    displayTextColor: textColor, // Always set text color based on mode
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialTheme = (): Theme => {
    try {
      const savedTheme = localStorage.getItem("app-theme");
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);

        // Ensure colorblind adjustments only happen when enabled
        const displayTextColor = parsedTheme.isColorblindMode
          ? adjustColor(
              parsedTheme.originalTextColor || parsedTheme.textColor,
              parsedTheme.colorblindType,
            )
          : parsedTheme.originalTextColor || parsedTheme.textColor;

        const displayBackgroundColor = parsedTheme.isColorblindMode
          ? adjustColor(
              parsedTheme.originalBackgroundColor ||
                parsedTheme.backgroundColor,
              parsedTheme.colorblindType,
            )
          : parsedTheme.originalBackgroundColor || parsedTheme.backgroundColor;

        return {
          ...parsedTheme,
          displayTextColor,
          displayBackgroundColor,
          adjustColorForColorblindness: (color: string) =>
            parsedTheme.isColorblindMode
              ? adjustColor(color, parsedTheme.colorblindType)
              : color,
        };
      }
    } catch {
      console.error("Error loading theme");
    }

    // Default theme
    return {
      ...colorSchemes[2],
      isColorblindMode: false,
      colorblindType: "protanopia",
      isDarkMode: false,
      font: '"KG What The Teacher Wants"',
      headingFont: '"KG What The Teacher Wants"',
      buttonFont: '"KG What The Teacher Wants"',
      originalTextColor: colorSchemes[2].textColor,
      originalBackgroundColor: colorSchemes[2].backgroundColor,
      displayTextColor: colorSchemes[2].textColor,
      displayBackgroundColor: colorSchemes[2].backgroundColor,
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

  const updateTheme = (newTheme: Theme) => {
    setTheme(setThemeWithColorAdjustment(newTheme));
  };

  const setColorblindMode = (isEnabled: boolean) => {
    setTheme((prevTheme) => {
      const originalTextColor =
        prevTheme.originalTextColor || prevTheme.textColor;
      const originalBackgroundColor =
        prevTheme.originalBackgroundColor || prevTheme.backgroundColor;

      const newTheme = {
        ...prevTheme,
        isColorblindMode: isEnabled,
        originalTextColor,
        originalBackgroundColor,
      };

      if (isEnabled) {
        return {
          ...newTheme,
          displayTextColor: adjustColor(
            originalTextColor,
            prevTheme.colorblindType,
          ),
          displayBackgroundColor: adjustColor(
            originalBackgroundColor,
            prevTheme.colorblindType,
          ),
          textColor: adjustColor(originalTextColor, prevTheme.colorblindType),
          backgroundColor: adjustColor(
            originalBackgroundColor,
            prevTheme.colorblindType,
          ),
        };
      } else {
        return setThemeWithColorAdjustment(newTheme); // Adjust text color based on background
      }
    });
  };

  const setColorblindType = (type: string) => {
    setTheme((prevTheme) => {
      const updatedTheme = {
        ...prevTheme,
        colorblindType: type,
      };

      if (prevTheme.isColorblindMode) {
        const originalTextColor =
          prevTheme.originalTextColor || prevTheme.textColor;
        const originalBackgroundColor =
          prevTheme.originalBackgroundColor || prevTheme.backgroundColor;

        return {
          ...updatedTheme,
          displayTextColor: adjustColor(originalTextColor, type),
          displayBackgroundColor: adjustColor(originalBackgroundColor, type),
          textColor: adjustColor(originalTextColor, type),
          backgroundColor: adjustColor(originalBackgroundColor, type),
        };
      }

      return updatedTheme;
    });
  };

  const toggleDarkMode = () => {
    setTheme((prevTheme) => {
      const newIsDarkMode = !prevTheme.isDarkMode;

      // Special handling for Black and White themes
      if (prevTheme.name === "White" || prevTheme.name === "Black") {
        const newTextColor = prevTheme.name === "White" ? "#000000" : "#FFFFFF"; // Set text color based on theme
        return {
          ...prevTheme,
          isDarkMode: newIsDarkMode,
          textColor: newTextColor,
          displayTextColor: newTextColor,
        };
      }

      // For all other themes, follow the dark/light mode logic
      return {
        ...prevTheme,
        isDarkMode: newIsDarkMode,
        backgroundColor: newIsDarkMode
          ? darkenColor(prevTheme.backgroundColor, 0.5)
          : lightenColor(prevTheme.backgroundColor, 0.5),
        textColor: newIsDarkMode ? "#FFFFFF" : "#000000",
        displayBackgroundColor: newIsDarkMode
          ? darkenColor(
              prevTheme.displayBackgroundColor || prevTheme.backgroundColor,
              0.5,
            )
          : lightenColor(
              prevTheme.displayBackgroundColor || prevTheme.backgroundColor,
              0.5,
            ),
        displayTextColor: newIsDarkMode ? "#FFFFFF" : "#000000",
      };
    });
  };

  const setFont = (font: string) => {
    setTheme((prevTheme) => {
      const newTheme = { ...prevTheme, font };
      document.documentElement.style.setProperty("--font-family", font); // Set the CSS variable
      return newTheme;
    });
  };

  const setHeadingFont = (font: string) => {
    setTheme((prevTheme) => {
      // Handle special cases for fonts with spaces or quotes
      const cssFont = font.replace(/^["'](.+)["']$/, "$1");
      let formattedFont = cssFont;

      // Special handling for fonts with spaces or special names
      if (
        cssFont.includes(" ") ||
        cssFont === "KG Shake It Off" ||
        cssFont === "KG What The Teacher Wants" ||
        cssFont === "Baloo 2"
      ) {
        formattedFont = `"${cssFont}"`;
      }

      document.documentElement.style.setProperty(
        "--heading-font-family",
        formattedFont,
      );
      return { ...prevTheme, headingFont: font };
    });
  };

  const setButtonFont = (font: string) => {
    setTheme((prevTheme) => {
      // Handle special cases for fonts with spaces or quotes
      const cssFont = font.replace(/^["'](.+)["']$/, "$1");
      let formattedFont = cssFont;

      // Special handling for fonts with spaces or special names
      if (
        cssFont.includes(" ") ||
        cssFont === "KG Shake It Off" ||
        cssFont === "KG What The Teacher Wants" ||
        cssFont === "Baloo 2"
      ) {
        formattedFont = `"${cssFont}"`;
      }

      document.documentElement.style.setProperty(
        "--button-font-family",
        formattedFont,
      );
      return { ...prevTheme, buttonFont: font };
    });
  };

  const setMainTextColor = (color: string) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      originalTextColor: color,
      displayTextColor: color, // Update display text color
    }));
  };

  // Add a new ref to track initial load
  const isInitialLoad = useRef(true);

  // Add this effect before the main theme effect
  useEffect(() => {
    // Initialize theme colors on mount
    if (theme.isColorblindMode) {
      const adjustedTextColor = adjustColor(
        theme.originalTextColor || theme.textColor,
        theme.colorblindType,
      );
      const adjustedBackgroundColor = adjustColor(
        theme.originalBackgroundColor || theme.backgroundColor,
        theme.colorblindType,
      );

      setTheme((prevTheme) => ({
        ...prevTheme,
        displayTextColor: adjustedTextColor,
        displayBackgroundColor: adjustedBackgroundColor,
      }));
    } else {
      // Ensure we reset to original colors when colorblind mode is off
      setTheme((prevTheme) => ({
        ...prevTheme,
        displayTextColor: prevTheme.originalTextColor || prevTheme.textColor,
        displayBackgroundColor:
          prevTheme.originalBackgroundColor || prevTheme.backgroundColor,
      }));
    }
  }, [theme.isColorblindMode]); // Add dependency on colorblind mode

  // Modify the useEffect that handles theme changes
  useEffect(() => {
    if (isInitialLoad.current) {
      // Even on initial load, we should set the saved theme
      const savedTheme = localStorage.getItem("app-theme");
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        const currentBackgroundColor =
          parsedTheme.displayBackgroundColor || parsedTheme.backgroundColor;

        // Set the CSS variables immediately
        document.documentElement.style.setProperty(
          "--background-color",
          currentBackgroundColor,
        );
        document.documentElement.style.setProperty(
          "--display-background-color",
          currentBackgroundColor,
        );
      }
      isInitialLoad.current = false;
      return;
    }

    console.log("Applying theme changes");

    // Ensure we're using the correct colors based on colorblind mode
    const effectiveTheme = {
      ...theme,
      displayTextColor: theme.isColorblindMode
        ? adjustColor(
            theme.originalTextColor || theme.textColor,
            theme.colorblindType,
          )
        : theme.originalTextColor || theme.textColor,
      displayBackgroundColor: theme.isColorblindMode
        ? adjustColor(
            theme.originalBackgroundColor || theme.backgroundColor,
            theme.colorblindType,
          )
        : theme.originalBackgroundColor || theme.backgroundColor,
    };

    // Save the complete theme state
    localStorage.setItem("app-theme", JSON.stringify(effectiveTheme));

    // Use the effective background color
    const currentBackgroundColor =
      effectiveTheme.displayBackgroundColor || effectiveTheme.backgroundColor;

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
      console.log("Setting background color to:", currentBackgroundColor);
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = currentBackgroundColor;
      document.documentElement.style.setProperty(
        "--background-color",
        currentBackgroundColor,
      );
    }

    // Update CSS custom properties with effective colors
    document.documentElement.style.setProperty(
      "--text-color",
      theme.originalTextColor,
    );
    document.documentElement.style.setProperty(
      "--display-background-color",
      currentBackgroundColor || "",
    );
    document.documentElement.style.setProperty(
      "--display-text-color",
      theme.displayTextColor || "",
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

    document.documentElement.style.setProperty(
      "--font-family",
      effectiveTheme.font,
    );
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
    updateTheme,
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
    setMainTextColor,
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
