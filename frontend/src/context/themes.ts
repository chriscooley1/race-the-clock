export interface Theme {
  backgroundColor: string;
  color: string;
}

export const defaultTheme: Theme = {
  backgroundColor: "#fff",
  color: "#000",
};

export const darkTheme: Theme = {
  backgroundColor: "#333",
  color: "#fff",
};

export const lightTheme: Theme = {
  backgroundColor: "#f5f5f5",
  color: "#333",
};
