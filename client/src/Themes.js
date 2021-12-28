import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFAEA6",
      grey: "#d4d4d4",
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
