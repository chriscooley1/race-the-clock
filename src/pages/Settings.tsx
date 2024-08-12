import React from "react";
import { useTheme, colorSchemes } from "../context/ThemeContext";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = colorSchemes.find(scheme => scheme.name === event.target.value);
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Settings</h2>
      <div>
        <label htmlFor="theme-select">Theme:</label>
        <select
          id="theme-select"
          value={theme.name}
          onChange={handleThemeChange}
        >
          {colorSchemes.map(scheme => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Settings;
