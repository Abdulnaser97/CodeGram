import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FFAEA6",
      pinkerPink: "#ff8b8b",
      grey: "#d4d4d4",
      darkGrey: "#8f8f8f",
      lightGrey: "#adadad",
      darkestGrey: "#767676",
    },
    secondary: {
      main: "#FFEBEB",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 20,
  },
  overrides: {},
});
