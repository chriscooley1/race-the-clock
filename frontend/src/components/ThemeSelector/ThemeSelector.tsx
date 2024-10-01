import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { appBackgroundColors, collectionColorSchemes, ColorScheme } from "../../constants/colorSchemes";

const ThemeSelector: React.FC = () => {
  const { setTheme, theme, setDisplayTextColor, setDisplayBackgroundColor } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScheme: ColorScheme | undefined = (appBackgroundColors as ColorScheme[]).find(
      (scheme: ColorScheme) => scheme.name === event.target.value
    );
    if (selectedScheme) {
      setTheme({
        ...selectedScheme,
        isColorblindMode: false,
        colorblindType: "none",
        isDarkMode: selectedScheme.name === "Black",
      });
    }
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected text color:", event.target.value);
    setDisplayTextColor(event.target.value);
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected background color:", event.target.value);
    setDisplayBackgroundColor(event.target.value);
  };

  return (
    <div className="bg-[#cceeff] text-inherit border-none p-4 rounded-md mt-5 w-full max-w-[300px]">
      <label htmlFor="theme-select" className="block mb-2 font-bold">Select App Background:</label>
      <select
        id="theme-select"
        value={theme.name}
        onChange={handleThemeChange}
        className="w-full p-2 mb-4 text-black bg-white border border-gray-300 rounded-md appearance-none bg-no-repeat bg-right-8-center"
        style={{backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")"}}
      >
        {(appBackgroundColors as ColorScheme[]).map((scheme: ColorScheme, index: number) => (
          <option key={index} value={scheme.name}>
            {scheme.name}
          </option>
        ))}
      </select>

      <label htmlFor="text-color-select" className="block mb-2 font-bold">Select Display Text Color:</label>
      <select
        id="text-color-select"
        value={theme.displayTextColor || theme.textColor}
        onChange={handleTextColorChange}
        className="w-full p-2 mb-4 text-black bg-white border border-gray-300 rounded-md appearance-none bg-no-repeat bg-right-8-center"
        style={{backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")"}}
      >
        {collectionColorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.textColor}>
            {scheme.name} Text Color
          </option>
        ))}
      </select>

      <label htmlFor="background-color-select" className="block mb-2 font-bold">Select Display Background Color:</label>
      <select
        id="background-color-select"
        value={theme.displayBackgroundColor || theme.backgroundColor}
        onChange={handleBackgroundColorChange}
        className="w-full p-2 mb-4 text-black bg-white border border-gray-300 rounded-md appearance-none bg-no-repeat bg-right-8-center"
        style={{backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")"}}
      >
        {collectionColorSchemes.map((scheme, index) => (
          <option key={index} value={scheme.backgroundColor}>
            {scheme.name} Background
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
