import "./App.css";
import { Helmet } from "react-helmet";
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
  getCheckRunResult,
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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useDispatch } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getPublicRepoFiles, getRepoFiles } from "./Redux/actions/repoFiles";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Themes";
import { loadDiagram } from "./Redux/actions/loadDiagram";
import { storeRepoFiles } from "./Redux/actions/repoFiles";
import SourceDoc from "./SourceDoc/SourceDoc";
import { useReactFlow } from "react-flow-renderer";
import Fuse from "fuse.js";

// pages
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
} from "./Redux/actions/notification";
import pageMeta from "./Utils/pageMeta";

//templates
//import * as data from './Templates/FullStackTemplate.CodeGram';

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
  const {
    nodesArr,
    repoFiles,
    isLoadingDiagram,
    publicRepoURL,
    isFetchingFiles,
    isReloadDiagram,
    RFState,
  } = useSelector((state) => {
    return {
      nodesArr: state.nodes.nodesArr,
      isLoadingDiagram: state.nodes.isLoadingDiagram,
      repoFiles: state.repoFiles.repoFiles,
      publicRepoURL: state.repoFiles.publicRepoURL,
      isFetchingFiles: state.repoFiles.isFetchingFiles,
      isReloadDiagram: state.RFState.reloadDiagram,
      RFState: state.RFState,
    };
  });
  const rf = useReactFlow();
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
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState("default");
  const [branch, setBranch] = useState("");
  const [repoBranches, setRepoBranches] = useState([]);
  const [prFiles, setPRFiles] = useState([]);
  const [prSha, setPRSha] = useState(null);
  // const [prFiles, setPRFiles] = useState(null);
  // redux
  const dispatch = useDispatch();

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

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
    nodes: nodes,
    addNode,
    addLineNode,
    setNodes: setNodes,
    setEdges: setEdges,
    setNodeName,
    onElementsRemove,
    initialElements,
    selectedEL,
    rfInstance,
    setSelectedEL,
    addFileToNode,
    tabValue,
    setTabValue,
  } = useReactFlowWrapper({
    dispatch,
    selectedShapeName,
    activeToolBarButton,
    setActiveToolBarButton,
    openArtifact,
    setOpenArtifact,
    search,
    setSearch,
    fuse,
    prFiles,
  });

  // change cursor to be opposite as previous
  useEffect(() => {
    if (activeToolBarButton === "selectShape") {
      setCursor("crosshair");
    } else if (activeToolBarButton === "TextIcon") {
      setCursor("text");
    } else {
      setCursor("default");
    }
  }, [activeToolBarButton]);

  // TODO: think about when to release selecttion on create node
  // useEffect(() => setCursor('default'), [selectedEL]).

  // get all repos in users account
  const getRepoList = async () => {
    const userRepos = await getRepos();
    setRepos(userRepos.data);
  };

  // get all branches in repo
  const getBranchesList = async (repo, owner = null) => {
    const repoBranches = await getBranches(repo, owner);
    setRepoBranches(repoBranches.data);
  };

  // get codegram scanner result
  const getCheckRunFiles = async (repo, sha) => {
    try {
      let checkRuns = await getCheckRunResult(repo, sha);
      if (!checkRuns || !checkRuns.data || !checkRuns.data.check_runs) {
        throw new Error("Could not Retrieve CheckRuns");
      }
      checkRuns = checkRuns.data.check_runs;

      // retrieve checrun with name CodeGram Scanner
      const codeGramScanner = checkRuns.find(
        (checkRun) => checkRun.name === "CodeGram Scanner"
      );
      if (!codeGramScanner) {
        throw new Error("CodeGram Scanner CheckRun not found");
      }
      console.log(codeGramScanner);
      setPRFiles(codeGramScanner);
    } catch (err) {
      console.log("Error: Failed To Retrieve CheckRun Files", err);
      dispatch(
        errorNotification(
          `Failed To Retrieve PR Files, you can still link the PR files from the Repo tab in SourceDoc`
        )
      );
    }
  };

  useEffect(() => {
    const get = async (r, s) => {
      console.log("getting");
      await getCheckRunFiles(r, s);
    };
    console.log("PR USEEFFECT");
    if (prSha && repo) get(repo, prSha);
  }, [prSha]);

  // set new repo from drop down menu
  const handleRepoChange = (event) => {
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
    setRepo(event.target.value);
    setSelectedEL(initialElements[0]);
    setBranch("");

    const url = new URL(window.location.href);
    if (url.searchParams.get("branch")) {
      url.searchParams.delete("branch");
    }
    url.searchParams.set("repo", event.target.value);
    window.history.replaceState(null, null, url);
  };

  useEffect(() => {
    if (publicRepoURL && publicRepoURL.length > 0 && repoFiles.length === 0) {
      // extract repo name from public url
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get("repo")) {
          url.searchParams.delete("repo");
        }
        if (url.searchParams.get("branch")) {
          url.searchParams.delete("branch");
        }

        window.history.replaceState(null, null, url);
        const repoName = publicRepoURL.split("/")[4];
        const userName = publicRepoURL.split("/")[3];
        const formattedURL =
          "https://api.github.com/" + userName + "/" + repoName;

        setRepos([...repos, { name: repoName }]);
        setNodes(initialElements.nodes);
        setEdges(initialElements.edges);
        dispatch(getPublicRepoFiles(repoName, formattedURL));
        setRepo(repoName);
        setSelectedEL(initialElements[0]);
        setBranch("");
        url.searchParams.set("repo", repoName);
        window.history.replaceState(null, null, url);
      } catch (e) {
        console.log(e);
        dispatch(
          errorNotification(
            `Failed to retrieve repo from url, issue is reported.`
          )
        );
      }
    }
  }, [publicRepoURL, initialElements, repoFiles, repo]);

  // set new branch from drop down menu
  const handleBranchChange = (event) => {
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
    dispatch(getRepoFiles(repo, event.target.value));
    setSelectedEL(initialElements[0]);
    setBranch(event.target.value);
    const url = new URL(window.location.href);
    url.searchParams.set("branch", event.target.value);
    window.history.replaceState(null, null, url);
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
      branchChoiceItems.push(<option value={""}>Select branch</option>);
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

  // Save Diagram: Push redux store content to github repo
  const onSave = useCallback(async () => {
    if (!loggedIn) {
      const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      window.location.assign(`${REACT_APP_BACKEND_URL}/auth/github`);
    }

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

  // get branch lists whenever repo changes
  useEffect(() => {
    if (repo) {
      getBranchesList(repo);
    }
  }, [repo]);

  // If redirect from github Checks, get the repo from the url params
  useEffect(() => {
    if (!repo && params.repo) {
      // extend repos state to include the repo in the url params
      setRepo(params.repo);

      //dispatch(getRepoFiles(params.get("repo"), params.get("branch")));
    }
  }, [repo, params]);

  // If redirect from github Checks, get the branch from the url params
  useEffect(() => {
    if (repo && repoBranches && params.branch && !branch) {
      console.log(params);
      console.log(params.sha);
      setBranch(params.branch);
      setPRSha(params.sha);
    }
  }, [repoBranches, params.branch, repo, branch]);

  useEffect(() => {
    // if repo and branch and not isFetchingFiles, retrieve repo files
    if (repo && branch) {
      dispatch(getRepoFiles(repo, branch));
    }
  }, [repo, branch]);

  useEffect(() => {
    if (isReloadDiagram && Object.keys(repoFiles).length > 0) {
      dispatch(loadDiagram(repoFiles));
    }
  }, [isReloadDiagram, repoFiles]);
  // create home path, and search engine after all loads

  useEffect(() => {
    try {
      if (
        repo &&
        repoFiles &&
        Object.keys(repoFiles).length > 0 &&
        !isFetchingFiles &&
        (branch || publicRepoURL) &&
        !isLoadingDiagram
      ) {
        var homeDir = [];

        console.log("Loading Diagram...");

        // push home directory files into home path as array
        for (const [key, val] of Object.entries(repoFiles)) {
          key.split("/").length === 1 && homeDir.push(val);
        }

        // set files in pulled repo to be linked if files
        // in current react flow elements
        if (RFState?.RFState?.nodes) {
          for (const node of RFState?.RFState?.nodes) {
            if (!node.data) {
              continue;
            }
            if (repoFiles[node.data.path]) {
              console.log(node.label);
              repoFiles[node.data.path].linked = true;
            }
          }
        }

        var hPath = {
          name: repo,
          dir: homeDir,
          path: repo,
        };
        const myFuse = new Fuse(Object.values(repoFiles), options);
        setHomePath(hPath);
        setFuse(myFuse);
        dispatch(storeRepoFiles(repoFiles));
      }
    } catch (err) {
      console.log(err);
      dispatch(errorNotification(`Error loading repository ${repo}`));
    }
  }, [repoFiles, isFetchingFiles, isLoadingDiagram, branch, publicRepoURL]);

  // Retrieves user details once authenticated
  useEffect(() => {
    try {
      getUser().then((userDetails) => {
        if (userDetails) {
          setUser(userDetails.user);
          setLoggedIn(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
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
  return (
    <ThemeProvider theme={theme}>
      <NotifError />

      <div className="App" style={{ cursor: cursor }}>
        <Helmet>
          <title>{`${pageMeta.title}`}</title>
          <meta name="description" content={pageMeta.description} />
          <meta name="keywords" content={pageMeta.keywords.join(",")} />
        </Helmet>
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
              {/* redirect to home page */}
              <div
                className="LogoWrapper"
                onClick={() => (window.location = window.location.origin)}
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

            <Box sx={{ flexGrow: 1, p: 2, color: "white", "box-shadow": 0 }}>
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
                    boxShadow: repo && !branch ? "-2.5px 4px 5px #c9c9c9" : "",
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
                    {loggedIn ? "Save" : "Login to Save"}
                  </Typography>
                </Box>
              </div>
            </Box>
            {loggedIn && (
              <Box sx={{ "box-shadow": 0 }}>
                <div className="navbar-button github" onClick={() => logout()}>
                  <LogoutIcon color="primary"> </LogoutIcon>
                </div>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        {/* everything from here down can be in a cashboard component */}

        <Typography
          className="welcomeMessage"
          fontWeight="2vh"
          color="primary.grey"
        >
          Welcome to CodeGram {user.username}!
        </Typography>
        {toolBarRender}
        <Container className="canvasContainer">{render}</Container>
        <SourceDoc
          functions={{
            addNode: addNode,
            addLineNode: addLineNode,
            deleteNode: onElementsRemove, //TODO: Add deleteNode function to DELETE NODE button(?)
            getPRContent: getPRContent,
            handleName: handleName,
            setSelectedEL: setSelectedEL,
            setIsOpenSD: setIsOpenSD,
            setNodes: setNodes,
            setEdges: setEdges,
            setOpenArtifact: setOpenArtifact,
            addFileToNode: addFileToNode,
            setTabValue: setTabValue,
            handleSearch: handleSearch,
            getRepoFiles: getRepoFiles,
          }}
          data={{
            repo: repo,
            repoData: repoData,
            selectedEL: selectedEL,
            isOpenSD: isOpenSD,
            fuse: fuse,
            repository: repoFiles,
            search: search,
            homePath: homePath,
            branch: branch,
            openArtifact: openArtifact,
            tabValue: tabValue,
            nodes: nodes,
          }}
        />
        <NotifDiagramLoading />

        <NotifDiagramLoaded />
      </div>
    </ThemeProvider>
  );
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
