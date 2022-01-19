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
  getBranches,
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
  circularProgressClasses,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useDispatch } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getRepoFiles } from "./Redux/actions/repoFiles";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Themes";
import { loadDiagram } from "./Redux/actions/loadDiagram";
import { storeRepoFiles } from "./Redux/actions/repoFiles";
import SourceDoc from "./SourceDoc/SourceDoc";
import { ReactFlowProvider } from "react-flow-renderer";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
} from "./canvas/custom_node";

import Fuse from "fuse.js";

// pages
import { LandingPage } from "./Landing/LandingPage";

import SourceDocButton from "./Media/SourceDocButton";
import useToolBar from "./components/ToolBar.js";
import {
  NotifDiagramLoaded,
  NotifDiagramLoading,
  NotifError,
} from "./components/NotificationsPopups";
import {
  errorNotification,
  successNotification,
  loadingNotification,
} from "./Redux/actions/notification";

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
  const { nodesArr, repoFiles, repository, isLoadingDiagram } = useSelector(
    (state) => {
      return {
        nodesArr: state.nodes.nodesArr,
        isLoadingDiagram: state.nodes.isLoadingDiagram,
        repoFiles: state.repoFiles,
        repository: state.repoFiles.repoFiles,
      };
    }
  );

  //  console.log(nodesArr)

  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const [repoData, setRepoData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOpenSD, setIsOpenSD] = useState(true);
  const [fuse, setFuse] = useState(null);
  const [homePath, setHomePath] = useState(null);
  const [openArtifact, setOpenArtifact] = useState("");
  const [search, setSearch] = useState("search");
  const [cursor, setCursor] = useState("default");
  const [branch, setBranch] = useState("");
  const [repoBranches, setRepoBranches] = useState([]);
  console.log(branch);
  // redux
  const dispatch = useDispatch();

  const options = {
    keys: ["name"],
  };

  //Dereference ToolBar function to access render
  const {
    toolBarRender,
    selectedShapeName,
    activeToolBarButton,
    setActiveToolBarButton,
  } = useToolBar();
  const {
    render,
    addNode,
    setElements,
    setNodeName,
    onElementsRemove,
    initialElements,
    selectedEL,
    rfInstance,
    setSelectedEL,
  } = useReactFlowWrapper({
    dispatch,
    selectedShapeName,
    activeToolBarButton,
    setActiveToolBarButton,
  });

  // change cursor to be opposite as previous
  useEffect(() => {
    activeToolBarButton === "selectShape"
      ? setCursor("crosshair")
      : setCursor("default");
  }, [activeToolBarButton]);

  // TODO: think about when to release selecttion on create node
  // useEffect(() => setCursor('default'), [selectedEL]).

  // get all repos in users account
  const getRepoList = async () => {
    const userRepos = await getRepos();
    setRepos(userRepos.data);
  };

  // get all branches in repo
  const getBranchesList = async (repo) => {
    const repoBranches = await getBranches(repo);
    setRepoBranches(repoBranches.data);
  };

  // set new repo from drop down menu
  const handleRepoChange = (event) => {
    // if (event.target.value){
    // getBranchesList(event.target.value)
    setElements(initialElements);
    getBranchesList(event.target.value);
    setRepo(event.target.value);
    setBranch("");
    // }
  };

  // set new branch from drop down menu
  const handleBranchChange = (event) => {
    setElements(initialElements);
    dispatch(getRepoFiles(repo, event.target.value));
    setBranch(event.target.value);
  };

  const handleName = (event, newValue) => {
    setNodeName(event.target.value);
  };

  const renderRepos = () => {
    var repoChoiceItems = [];

    if (repos.length !== 0 && repos !== undefined) {
      repoChoiceItems.push(<option value={""}>Repository</option>);
      for (var i = 0; i < repos.length; i++) {
        var name = repos[i].name;
        repoChoiceItems.push(<option value={name}>{name}</option>);
      }
    } else {
      return <option value="">Login to see repositories!</option>;
    }

    return repoChoiceItems;
  };

  const renderBranches = () => {
    var branchChoiceItems = [];
    if (repo && repoBranches != undefined && repoBranches.length !== 0) {
      branchChoiceItems.push(<option value={""}>Branch</option>);
      for (var i = 0; i < repoBranches.length; i++) {
        var name = repoBranches[i].name;
        branchChoiceItems.push(<option value={name}>{name}</option>);
      }
    } else {
      return <option value="">Choose repo to see branches</option>;
    }

    return branchChoiceItems;
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
      const result = await save(repo, branch, flow);
      console.log(result);
      if (result.status === 200 || result.status === 201) {
        dispatch(successNotification(`Successfully saved diagram to ${repo}`));
      } else {
        dispatch(errorNotification(`Error saving diagram to github repo`));
      }
    }
  }, [repo, rfInstance, branch]);

  /** useEffect Hools ************************************************* useEffect Hooks *****************************************************************/

  // // Load saved diagram when new repo is selected
  // useEffect(() => {
  //   repo && getBranchesList(repo)
  // }, [repo]);

  // Load saved diagram when new repo is selected
  useEffect(() => {
    if (repo && !repoFiles.isFetchingFiles && repoFiles.repoFiles && branch) {
      dispatch(loadDiagram(repoFiles.repoFiles));
    }
  }, [repo, dispatch, repoFiles.isFetchingFiles, branch]);

  // create home path, and search engine after all loads
  useEffect(() => {
    try {
      if (repo && repository && !repoFiles.isFetchingFiles && branch) {
        var homeDir = [];

        dispatch(loadingNotification(repo + " is being loaded.")); /////////////////////////////////////////////////////////
        console.log("loading diagram!");

        // push home directory files into home path as array
        for (const [key, val] of Object.entries(repository)) {
          key.split("/").length === 1 && homeDir.push(val);
        }

        // set files in pulled repo to be linked if files
        // in current react flow elements
        for (const node of nodesArr) {
          if (!node.data) {
            continue;
          }
          if (repository[node.data.path]) {
            repository[node.data.path].linked = true;
          }
        }

        var hPath = {
          name: repo,
          dir: homeDir,
          path: repo,
        };

        const myFuse = new Fuse(Object.values(repository), options);
        setHomePath(hPath);
        setFuse(myFuse);
        dispatch(storeRepoFiles(repository));
        dispatch(successNotification(repo + " has been loaded!"));
      }
    } catch (err) {
      console.log(err);
      dispatch(errorNotification(`Error loading repository ${repo}`));
    }
  }, [repoFiles.isFetchingFiles, isLoadingDiagram, branch]);

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

  const handleSearch = (event, newValue) => {
    // set null during search so any clicks after a serach still trigger rerender
    setSearch(event.target.value);
  };

  if (loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <NotifError />
        <ReactFlowProvider>
          <div className="App" style={{ cursor: cursor }}>
            {!isOpenSD && (
              <div
                className="SourceDocButtonWrapper"
                onClick={() => setIsOpenSD((prevIsOpenSD) => !prevIsOpenSD)}
              >
                <SourceDocButton />
              </div>
            )}
            {/* move app bar to its own navigation component  */}
            <AppBar
              elevation={0}
              position="sticky"
              sx={{
                backgroundColor: "#f7f7f7",
                borderColor: "black",
                borderWidth: "1",
                height: "8vh",
              }}
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
                <Box
                  sx={{ flexGrow: 1, p: 2, color: "white", "box-shadow": 0 }}
                >
                  <FormControl fullWidth variant="outlined">
                    <select
                      className=""
                      value={repo}
                      label="Repository"
                      onChange={handleRepoChange}
                      placeholder="Choose your repository"
                      style={{
                        borderRadius: "0.6vw",
                        "padding-left": "20px",
                        "padding-right": "20px",
                        outline: "none",
                        height: "4vh",
                        border: "1px solid #ffaea6",
                        color: "#FFAEA6",
                        background: "transparent",
                        appearance: "none",
                        cursor: "pointer",
                        boxShadow: !repo ? "-2.5px 4px 5px #c9c9c9" : "",
                      }}
                    >
                      {renderRepos()}
                    </select>
                  </FormControl>
                </Box>

                <Box
                  sx={{ flexGrow: 1, p: 2, color: "white", "box-shadow": 0 }}
                >
                  <FormControl fullWidth variant="outlined">
                    <select
                      className=""
                      value={branch}
                      label="Branch"
                      onChange={handleBranchChange}
                      placeholder="Choose your repository"
                      style={{
                        borderRadius: "0.6vw",
                        "padding-left": "20px",
                        "padding-right": "20px",
                        outline: "none",
                        height: "4vh",
                        border: "1px solid #ffaea6",
                        color: "#FFAEA6",
                        background: "transparent",
                        appearance: "none",
                        cursor: "pointer",
                        boxShadow:
                          repo && !branch ? "-2.5px 4px 5px #c9c9c9" : "",
                      }}
                    >
                      {renderBranches()}
                    </select>
                  </FormControl>
                </Box>

                <Box mx={2} sx={{ "box-shadow": 0 }}>
                  <div
                    className="navbar-button github"
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => onSave()}
                  >
                    <Box className="SaveButtonWrapper">
                      <Typography
                        mx={1}
                        my={0.8}
                        fontSize=".8vw"
                        fontWeight="Thin"
                        color="primary"
                      >
                        Save
                      </Typography>
                    </Box>
                  </div>
                </Box>

                <Box sx={{ "box-shadow": 0 }}>
                  <div
                    className="navbar-button github"
                    onClick={() => logout()}
                  >
                    <LogoutIcon color="primary"> </LogoutIcon>
                  </div>
                </Box>
              </Toolbar>
            </AppBar>
            {/* everything from here down can be in a cashboard component */}

            <Typography
              className="welcomeMessage"
              fontWeight="light"
              color="primary.grey"
              fontWeight={"2vh"}
            >
              Welcome to CodeGram demo {user.username}!
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                position: "fixed",
                top: "8vh",
                right: "2vw",
                width: "40vw",
              }}
            >
              <div className="SourceDocMinimize" />

              <Typography
                fontSize={"1vw"}
                color={"primary.main"}
                fontWeight={"medium"}
                mx={1}
                my={0}
              >
                Search 
              </Typography>

              <input
                placeholder="Search Repo Content"
                onChange={handleSearch}
                onKeyPress={handleSearch}
                style={{
                  "z-index": 0,
                  border: "none",
                  backgroundColor: "rgb(247, 247, 247)",
                  boxShadow: 6,
                  color: "grey",
                  fontSize: "1vw",
                  outline: "none",
                  width: "65%",
                  fontWeight: theme.typography.fontWeightMedium,
                }}
              />
            </div>
            {toolBarRender}
            <Container className="canvasContainer">{render}</Container>
            <SourceDoc
              functions={{
                addNode: addNode,
                deleteNode: onElementsRemove, //TODO: Add deleteNode function to DELETE NODE button(?)
                printNodesArr: printNodesArr,
                getPRContent: getPRContent,
                handleName: handleName,
                setSelectedEL: setSelectedEL,
                setIsOpenSD: setIsOpenSD,
                setElements: setElements,
              }}
              data={{
                repo: repo,
                repoData: repoData,
                selectedEL: selectedEL,
                isOpenSD: isOpenSD,
                fuse: fuse,
                repository: repository,
                search: search,
                homePath: homePath,
                branch: branch,
              }}
            />
            <NotifDiagramLoading/>
            <NotifDiagramLoaded />
          </div>
        </ReactFlowProvider>
      </ThemeProvider>
    );
  } else {
    return <LandingPage />;
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
