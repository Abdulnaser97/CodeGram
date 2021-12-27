import React from "react";
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
import GitHubIcon from "@mui/icons-material/GitHub";

import styled from "styled-components";

// asset imports
import Logo3 from "../Media/Logo3.svg";
import { invalidateToken, save } from "../api/apiClient";

export const LogoTopNav = styled.div`
  position: relative;
  left: 0;
  padding-right: 1.25vw;
  height: 3vw;
  width: 3vw;
  background-image: url(${Logo3});
  background-size: contain;
  background-repeat: no-repeat;
`;
const NavigationBar = (props) => {
  const renderRepos = () => {
    var repoNames = [];
    var repoChoiceItems = [];

    if (props.data.repos.length !== 0 && props.data.repos.data !== undefined) {
      repoChoiceItems.push(<MenuItem value={""}>Repository</MenuItem>);
      for (var i = 0; i < props.data.repos.data.length; i++) {
        var name = props.data.repos.data[i].name;
        repoNames.push(name);
        repoChoiceItems.push(<MenuItem value={name}>{name}</MenuItem>);
      }
    } else {
      return <MenuItem value="">Login to see repositories!</MenuItem>;
    }

    return repoChoiceItems;
  };

  // Save Diagram: Push redux store content to github repo
  const saveChanges = async () => {
    const saveResult = await save(props.data.repo, props.data.nodesArr);
    console.log(saveResult);
  };

  const logout = async () => {
    await invalidateToken();
    sessionStorage.clear();
    window.location.assign("/");
    props.functions.setLoggedIn(false);
  };

  return (
    <AppBar
      elevation={0}
      position="sticky"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <Toolbar>
        <MenuItem
          sx={{ flexGrow: 3 }}
          style={{ backgroundColor: "transparent" }}
        >
          <div
            style={{
              position: "relative",
              height: "80%",
              left: "0",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LogoTopNav className="LogoTopNav" />
            <h2
              style={{
                fontFamily: "Poppins-Thin",
                color: "#FFAEA6",
              }}
            >
              CodeGram
            </h2>
          </div>
        </MenuItem>
        <Box sx={{ flexGrow: 1, p: 2, color: "white", "box-shadow": 0 }}>
          <FormControl fullWidth variant="outlined">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.data.repo}
              label="Repository"
              onChange={props.functions.handleRepoChange}
              sx={{ backgroundColor: "white" }}
              displayEmpty
            >
              {renderRepos()}
            </Select>
          </FormControl>
        </Box>

        <Box mx={1} sx={{ "box-shadow": 0 }}>
          <div className="loginButton github" onClick={() => saveChanges()}>
            <Typography mx={2} fontWeight="Medium" color="primary">
              {" "}
              Push{" "}
            </Typography>
            <GitHubIcon color="primary"> </GitHubIcon>
          </div>
        </Box>

        <Box sx={{ "box-shadow": 0 }}>
          <div className="loginButton github" onClick={() => logout()}>
            <LogoutIcon color="primary"> </LogoutIcon>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
