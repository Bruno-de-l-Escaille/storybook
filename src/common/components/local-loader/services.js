import themes, { BlueTheme } from "./themes";

export const getTheme = (theme) => {
  for (const value of Object.values(themes)) {
    if (value.name === theme) {
      return value;
    }
  }

  return BlueTheme;
};
