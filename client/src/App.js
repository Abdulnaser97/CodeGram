// styling
import "./App.css";
import axios from "axios";

// react
import styled from "styled-components";
import Github2 from "./Media/github.png";

import Logo3 from "./Media/Logo3.svg";

import React, { useCallback, useState, useRef, useEffect } from "react";

// api calls
import {
  invalidateToken,
  getRepo,
  getPR,
  getUser,
  getRepos,
} from "./api/apiClient";

// material ui components
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
// redux
import ReactFlow, { removeElements, addEdge } from "react-flow-renderer";
import { connect } from "react-redux";
import { addNodeToArray, deleteNodeFromArray } from "./Redux/actions/nodes";
import { useDispatch } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getRepoFiles } from "./Redux/actions/repoFiles";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./Themes";

// custom components
import SourceDoc from "./SourceDoc/SourceDoc";
import MyNavigationBar from "./components/MyNavigationBar";

// pages
import { LandingPage } from "./Landing/LandingPage";
import ToolBar from "./components/ToolBar.js";

const getNodeId = () => `randomnode_${+new Date()}`;

// api call import
function login() {
  window.open("http://localhost:8080/auth/github", "_self");
}

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

var initialElements = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "Project Root", url: "" },
    position: { x: 500, y: 300 },
    animated: true,
    style: {
      borderColor: "#FFAEA6",
      color: "#6E6E6E",
      height: "2vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
];

function App(props) {
  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const [repoData, setRepoData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [nodeName, setNodeName] = useState("nodeName");
  const [curCode, setCurCode] = useState("Select a nnode to view file");

  // Selected node
  const [selectedEL, setSelectedEL] = useState(initialElements[0]);
  // state for selected file
  const [selectedFile, setSelectedFile] = useState("");
  // react flow
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => {
    console.log("click", element);
    setSelectedEL(element);
  };

  // redux
  const nodesArr = props.nodes.nodesArr;
  const dispatch = useDispatch();

  // add node function
  const addNode = useCallback(
    (file) => {
      var label = nodeName;
      const newNode = {
        id: getNodeId(),
        // this data will get filled with the array of JSON objects that will come
        // from Github
        data: {
          label: file.fileName !== undefined ? file.fileName : label,
          name: file.fileName !== undefined ? file.fileName : label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          url: file.url !== undefined ? file.url : "",
        },
        style: {
          backgroundColor: "#FFAEA6",
          color: "white",
          fontWeight: "bold",
          height: "2vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
        },
        position: { x: 500, y: 400 },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch, selectedFile]
  );

  const onElementsRemove = (elementsToRemove) => {
    if (elementsToRemove.length == 0) {
      console.log("nothing selected");
      return;
    }
    dispatch(deleteNodeFromArray(elementsToRemove[0]));
  };

  // get all repos in users account
  const getRepoList = async () => {
    const userRepos = await getRepos();
    setRepos(userRepos);
  };

  // set new repo from drop down menu
  const handleRepoChange = (event) => {
    setRepo(event.target.value);
    setElements(initialElements);
    dispatch(getRepoFiles(event.target.value));
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

  useEffect(() => {
    if (selectedEL.data.url !== undefined) {
      // calls node url to get file content
      axios
        .get(selectedEL.data.url)
        .then(function (response) {
          // handle success
          console.log(response);
          setCurCode(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  }, [selectedEL]);

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
  if (loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          {/* move app bar to its own navigation component  */}
          <AppBar
            elevation={0}
            position="sticky"
            style={{ "background-color": "#f7f7f7" }}
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
                      "font-family": "Poppins-Thin",
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
                <div className="loginButton github">
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
          {/* everything from here down can be in a cashboard component */}
          <h1
            class="welcomeMessage"
            style={{
              "font-family": "Poppins-Thin",
              "text-align": "left",
              "padding-left": "5vw",
            }}
          >
            Welcome to CodeGram demo {user.username}!
          </h1>
          <ToolBar />
          <Container className="canvasContainer">
            <div className="canvas">
              <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={setRfInstance}
                onElementClick={onElementClick}
              />
            </div>
          </Container>
          <SourceDoc
            functions={{
              addNode: addNode,
              deleteNode: onElementsRemove, //TODO: Add deleteNode function to DELETE NODE button(?)
              printNodesArr: printNodesArr,
              getPRContent: getPRContent,
              handleName: handleName,
              setSelectedFile: setSelectedFile,
            }}
            data={{
              repo: repo,
              repoData: repoData,
              selectedEL: selectedEL,
              selectedFile: selectedFile,
              curCode: curCode,
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
