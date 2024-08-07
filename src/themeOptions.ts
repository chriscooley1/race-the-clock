interface Theme {
  name: string;
  className: string;
  backgroundColor: string;
  color: string;
  textColor: string;
}

export const themes: Theme[] = [
  { 
    name: "Light Mode", 
    className: "light-theme",
    backgroundColor: "#ffffff",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Dark Mode", 
    className: "dark-theme",
    backgroundColor: "#333333",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Blue Theme", 
    className: "blue-theme",
    backgroundColor: "#cceeff",
    color: "#003366",
    textColor: "#003366"
  },
  { 
    name: "Neon Pink", 
    className: "neon-pink-theme",
    backgroundColor: "#ff69b4",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Neon Green", 
    className: "neon-green-theme",
    backgroundColor: "#39ff14",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Neon Blue", 
    className: "neon-blue-theme",
    backgroundColor: "#1e90ff",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Neon Orange", 
    className: "neon-orange-theme",
    backgroundColor: "#ff4500",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Red", 
    className: "red-theme",
    backgroundColor: "#ff0000",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Orange", 
    className: "orange-theme",
    backgroundColor: "#ffa500",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Yellow", 
    className: "yellow-theme",
    backgroundColor: "#ffff00",
    color: "#000000",
    textColor: "#000000"
  },
  { 
    name: "Green", 
    className: "green-theme",
    backgroundColor: "#008000",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Blue", 
    className: "blue-theme-color",
    backgroundColor: "#0000ff",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Indigo", 
    className: "indigo-theme",
    backgroundColor: "#4b0082",
    color: "#ffffff",
    textColor: "#ffffff"
  },
  { 
    name: "Violet", 
    className: "violet-theme",
    backgroundColor: "#ee82ee",
    color: "#000000",
    textColor: "#000000"
  },
  // Add more themes as needed
];

export const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Green", value: "#00ff00" },
  { label: "Yellow", value: "#ffff00" },
  // Add more colors if needed
];
