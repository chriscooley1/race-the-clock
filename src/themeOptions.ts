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

export const textColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  // Pastel text colors
  { label: "Pastel Pink", value: "#ffccd5" },
  { label: "Pastel Green", value: "#ccffcc" },
  { label: "Pastel Blue", value: "#cce0ff" },
  { label: "Pastel Purple", value: "#e0ccff" },
  { label: "Pastel Yellow", value: "#fff9cc" },
  { label: "Pastel Red", value: "#ffc1c1" },
  { label: "Pastel Orange", value: "#ffe0b3" },
];
