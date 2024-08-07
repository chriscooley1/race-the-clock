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
    textColor: "#333333"
  },
  { 
    name: "Dark Mode", 
    className: "dark-theme",
    backgroundColor: "#333333",
    color: "#ffffff",
    textColor: "#f5f5f5"
  },
  { 
    name: "Blue Theme", 
    className: "blue-theme",
    backgroundColor: "#e0f7fa",
    color: "#0077b6",
    textColor: "#000000"
  },
  { 
    name: "Neon Pink", 
    className: "neon-pink-theme",
    backgroundColor: "#ff00ff",
    color: "#ffffff",
    textColor: "#000000"
  },
  { 
    name: "Neon Green", 
    className: "neon-green-theme",
    backgroundColor: "#39ff14",
    color: "#ffffff",
    textColor: "#000000"
  },
  { 
    name: "Neon Blue", 
    className: "neon-blue-theme",
    backgroundColor: "#0ff",
    color: "#ffffff",
    textColor: "#000000"
  },
  { 
    name: "Neon Orange", 
    className: "neon-orange-theme",
    backgroundColor: "#ff6f00",
    color: "#ffffff",
    textColor: "#000000"
  },
  { 
    name: "Red", 
    className: "red-theme",
    backgroundColor: "#ffebee",
    color: "#b71c1c",
    textColor: "#000000"
  },
  { 
    name: "Orange", 
    className: "orange-theme",
    backgroundColor: "#fff3e0",
    color: "#e65100",
    textColor: "#000000"
  },
  { 
    name: "Yellow", 
    className: "yellow-theme",
    backgroundColor: "#fffde7",
    color: "#f9a825",
    textColor: "#000000"
  },
  { 
    name: "Green", 
    className: "green-theme",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    textColor: "#000000"
  },
  { 
    name: "Blue", 
    className: "blue-theme-color",
    backgroundColor: "#e3f2fd",
    color: "#1e88e5",
    textColor: "#000000"
  },
  { 
    name: "Indigo", 
    className: "indigo-theme",
    backgroundColor: "#e8eaf6",
    color: "#303f9f",
    textColor: "#000000"
  },
  { 
    name: "Violet", 
    className: "violet-theme",
    backgroundColor: "#f3e5f5",
    color: "#8e24aa",
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
