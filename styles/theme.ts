import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4A90E2",
    background: "#FFFFFF",
    card: "#F5F5F5",
    text: "#000000",
    border: "#E0E0E0",
    notification: "#FF3B30",
    secondary: "#aaaaaa",
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#4a90e2",
    background: "#0d1b1e",
    card: "#ffffff",
    text: "#ffffff",
    border: "#cccccc",
    notification: "#ff453a",
    secondary: "#aaaaaa",
  },
};

export type ThemeColors = typeof lightTheme.colors; 