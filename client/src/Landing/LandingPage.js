// third party imports 
import { Box, Typography } from '@mui/material';

// asset imports 
import Github from "../img/github.png";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "../AppUtils";
import GitHub from "./GitHub";
import Background from "./Background";
import Logo from "./Logo";

// api call import 
function login() {
  window.open("http://localhost:8080/auth/github", "_self");
}

export function LandingPage(){
  return(
    <ThemeProvider theme={theme}>
    <div className="LandingPage">
      <div className="LogoDiv background">
        <Background className="Background" />
      </div>
      <div className="LogoDiv">
        <Logo className="Logo" />
      </div>
      <Typography variant='h1' className='CodeGram'> CodeGram</Typography>
      <div className="GitHubButtonWrapper" onClick={login}>
        <GitHub className="GitHub" />
      </div>
    </div>
  </ThemeProvider>
  );
}