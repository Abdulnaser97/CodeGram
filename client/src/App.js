import "./App.css";
import styled from "styled-components";
import Logo3 from "./Media/Logo3.svg";
import React, { useState, useEffect, useCallback } from "react";
import { useReactFlowWrapper } from "./components/Canvas";
import {
  invalidateToken,
  getPR,
  getRepos,
  save,
  getUser,
} from "./api/apiClient";
import { connect, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useDispatch } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getRepoFiles } from "./Redux/actions/repoFiles";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./Themes";
import { loadDiagram } from "./Redux/actions/loadDiagram";
import SourceDoc from "./SourceDoc/SourceDoc";

import {
  CustomNodeComponent,
  WrapperNodeComponent,
} from "./canvas/custom_node";

// pages
import { LandingPage } from "./Landing/LandingPage";
import useToolBar from "./components/ToolBar.js";


const LogoTopNav = styled.div`
  position: relative;
  left: 0;
  padding-right: 1.25vw;
  height: 3vw;
  width: 3vw;
  background-image: url(${Logo3});
  background-size: contain;
  background-repeat: no-repeat;
`;

/**
 *
 *
 *
 *
 * App starts here
 *
 *
 *
 */
function App() {
  const { nodesArr, repoFiles } = useSelector((state) => {
    return { nodesArr: state.nodes.nodesArr, repoFiles: state.repoFiles };
  });

  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const [repoData, setRepoData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  // redux
  const dispatch = useDispatch();

  //Dereference ToolBar function to access render
  const { toolBarRender, selectedShapeName } = useToolBar();

  const {
    render,
    addNode,
    setElements,
    setNodeName,
    onElementsRemove,
    initialElements,
    selectedEL,
    rfInstance,
  } = useReactFlowWrapper({ dispatch, selectedShapeName });

  // get all repos in users account
  const getRepoList = async () => {
    const userRepos = await getRepos();
    setRepos(userRepos);
  };

  // set new repo from drop down menu
  const handleRepoChange = (event) => {
    setElements(initialElements);
    dispatch(getRepoFiles(event.target.value));
    setRepo(event.target.value);
  };

  const handleName = (event, newValue) => {
    setNodeName(event.target.value);
  };

  const renderRepos = () => {
    var repoNames = [];
    var repoChoiceItems = [];

    if (repos.length !== 0 && repos.data !== undefined) {
      repoChoiceItems.push(<MenuItem value={""}>Repository</MenuItem>);
      for (var i = 0; i < repos.data.length; i++) {
        var name = repos.data[i].name;
        repoNames.push(name);
        repoChoiceItems.push(<MenuItem value={name}>{name}</MenuItem>);
      }
    } else {
      return <MenuItem value="">Login to see repositories!</MenuItem>;
    }

    return repoChoiceItems;
  };

  const getPRContent = async () => {
    const PRContent = await getPR("hello-world", 1942);
    setContent(PRContent);
  };

  const logout = async () => {
    await invalidateToken();
    sessionStorage.clear();
    window.location.assign("/");
    setLoggedIn(false);
  };

  const printNodesArr = () => {
    console.log(`nodesArr:`);
    console.log(nodesArr);
    const jsonNodes = JSON.stringify(nodesArr);
    console.log("JSON String:");
    console.log(jsonNodes);

    const fs = require("browserify-fs");
    fs.writeFile("newNodes.txt", jsonNodes, { flag: "w+" }, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
  };

  // Save Diagram: Push redux store content to github repo
  const onSave = useCallback(async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const result = await save(repo, flow);
      console.log(result);
    }
  }, [repo, rfInstance]);

  /** useEffect Hools ************************************************* useEffect Hools *****************************************************************/

  // Load saved diagram when new repo is selected
  useEffect(() => {
    if (repo && !repoFiles.isFetchingFiles && repoFiles.repoFiles[0]) {
      dispatch(loadDiagram(repoFiles.repoFiles[0]));
    }
  }, [repo, dispatch, repoFiles]);

  // Retrieves user details once authenticated
  useEffect(() => {
    getUser().then((userDetails) => {
      setUser(userDetails.user);
      setLoggedIn(true);
    });
  }, []);

  // Stores Access token in session storage, Not very secure, but good for now
  useEffect(() => {
    if (user.length !== 0) {
      sessionStorage.setItem("access_token", user.access_token);
      getRepoList();
    }
  }, [user]);

  if (loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          {/* move app bar to its own navigation component  */}
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
                <div className="LogoWrapper">
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
                    value={repo}
                    label="Repository"
                    onChange={handleRepoChange}
                    sx={{ backgroundColor: "white" }}
                    displayEmpty
                  >
                    {renderRepos()}
                  </Select>
                </FormControl>
              </Box>

              <Box mx={1} sx={{ "box-shadow": 0 }}>
                <div
                  className="navbar-button github"
                  style={{ backgroundColor: "transparent" }}
                  onClick={() => onSave()}
                >
                  <Box mx={2} className="SaveButtonWrapper">
                    <Typography
                      mx={1}
                      my={0.8}
                      fontSize="1.3vw"
                      fontWeight="Thin"
                      color="primary"
                    >
                      Save
                    </Typography>
                  </Box>
                  <GitHubIcon color="primary"> </GitHubIcon>
                </div>
              </Box>

              <Box sx={{ "box-shadow": 0 }}>
                <div className="navbar-button github" onClick={() => logout()}>
                  <LogoutIcon color="primary"> </LogoutIcon>
                </div>
              </Box>
            </Toolbar>
          </AppBar>
          {/* everything from here down can be in a cashboard component */}

          <Typography
            className="welcomeMessage"
            fontWeight="light"
            variant="h6"
            color="primary.grey"
          >
            Welcome to CodeGram demo {user.username}!
          </Typography>

          {toolBarRender}

          <Container className="canvasContainer">{render}</Container>
          <SourceDoc
            functions={{
              addNode: addNode,
              deleteNode: onElementsRemove, //TODO: Add deleteNode function to DELETE NODE button(?)
              printNodesArr: printNodesArr,
              getPRContent: getPRContent,
              handleName: handleName,
            }}
            data={{
              repo: repo,
              repoData: repoData,
              selectedEL: selectedEL,
            }}
          />
        </div>
      </ThemeProvider>
    );
  } else {
    return <LandingPage />;
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
