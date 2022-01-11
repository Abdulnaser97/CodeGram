import "../App.css";

// asset imports
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Themes";
import GitHub from "./GitHub";
import Background from "./Background";
import Logo from "./Logo";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// api call import
function login() {
  document.domain = "code-gram.com";
  window.open(`${REACT_APP_BACKEND_URL}/auth/github`, "_self");
}

export function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="LandingPage">
        <div className="LogoDiv background">
          <Background className="Background" />
        </div>
        <div className="LogoDiv">
          <Logo className="Logo" />
        </div>
        <h1 className="CodeGram">CodeGram</h1>
        <div className="GitHubButtonWrapper" onClick={login}>
          <GitHub className="GitHub" />
        </div>
      </div>
    </ThemeProvider>
  );
}
