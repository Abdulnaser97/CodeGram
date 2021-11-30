// third party imports 
import { Box, Typography } from '@mui/material';

// asset imports 
import Github from "../img/github.png";

// api call import 
function login() {
  window.open("http://localhost:8080/auth/github", "_self");
}

export function Landing(){
  return(
    <Box
    sx={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}
    >
    <Typography variant="h1"> CodeGram</Typography>
    <div className="landingLogin" onClick={login}>
      <Typography variant="h4"> Login w/ GitHub</Typography>
      <img src={Github} alt="" className="icon" />
    </div>
    </Box>
  );
}