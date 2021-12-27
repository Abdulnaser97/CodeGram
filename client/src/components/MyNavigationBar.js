// Material UI imports
import {
  MenuItem,
  Box,
  Toolbar,
  FormControl,
  Select,
  AppBar,
  Typography,
} from "@mui/material";

import { LogoutIcon } from "@mui/icons-material/Logout";

import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// asset imports
import Github from "../Media/github.png";

function MyNavigationBar(props) {
  return (
    <AppBar position="sticky" style={{ background: "black" }}>
      <Toolbar>
        <MenuItem sx={{ flexGrow: 3 }}>
          <Typography variant="h5">CodeGram</Typography>
        </MenuItem>
        <Box sx={{ flexGrow: 1, p: 2, color: "white" }}>
          <FormControl fullWidth variant="outlined">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.data.repo}
              label="Repository"
              onChange={props.functions.handleRepoChange}
              sx={{ backgroundColor: "#E4E6EB" }}
              displayEmpty
            >
              {props.functions.renderRepos()}
            </Select>
          </FormControl>
        </Box>

        <Box mx={1}>
          <div className="navbar-button github">
            <Typography> Push </Typography>
            <img src={Github} alt="" className="icon" />
          </div>
        </Box>

        <Box mx={1}>
          <div
            className="navbar-button github"
            onClick={() => props.functions.logout()}
          >
            <LogoutIcon> </LogoutIcon>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MyNavigationBar);
