import "./App.css";
import styled from "styled-components";
import Github2 from "./img/github.png";
import GitHub from "./Landing/GitHub";
import Background from "./Landing/Background";
import Logo from "./Landing/Logo";
import Logo3 from "./img/Logo3.svg";

import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  invalidateToken,
  getRepo,
  getPR,
  getUser,
  getRepos,
} from "./api/apiClient";
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
import ReactFlow, { removeElements, addEdge } from "react-flow-renderer";

import { connect } from "react-redux";
import { addNodeToArray } from "./Redux/actions/nodes";
import { useDispatch } from "react-redux";
import { SourceDoc } from "./SourceDoc/SourceDoc";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getRepoFiles } from "./Redux/actions/repoFiles";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./AppUtils";

const getNodeId = () => `randomnode_${+new Date()}`;

const initialElements = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "Input Node" },
    position: { x: 100, y: 0 },
    animated: true,
    style: {
      borderColor: "#FFAEA6",
      color: "#6E6E6E",
      width: "4vw",
      height: "1vw",
    },
  },
];

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

function App(props) {
  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const [repoData, setRepoData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const [nodeName, setNodeName] = useState("nodeName");
  // Selected node
  const [selectedEL, setSelectedEL] = useState(0);

  // react flow
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => {
    console.log("click", element);
    setSelectedEL(element);
  };

  // redux
  const nodesArr = props.nodes.nodesArr;
  const dispatch = useDispatch();

  // add node function
  const addNode = useCallback(() => {
    var label = nodeName;
    const newNode = {
      ...initialElements[0],
      id: getNodeId(),
      // this data will get filled with the array of JSON objects that will come
      // from Github
      data: {
        label: label,
        name: label,
        linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
        childNodes: ["da", "de", "do"],
        siblingNodes: ["ta", "te", "to"],
        parentNodes: ["pa", "pe"],
        documentation: ["url1", "url2"],
        description: "",
      },
      position: {
        x: 100,
        y: yPos.current,
      },
      animated: true,
      style: {
        ...initialElements[0].style,
      },
    };
    dispatch(addNodeToArray(newNode));
    setElements((els) => els.concat(newNode));
  }, [setElements, nodeName, dispatch]);

  function login() {
    window.open("http://localhost:8080/auth/github", "_self");
  }

  // get all repos in users account
  const getRepoList = async () => {
    const userRepos = await getRepos();
    setRepos(userRepos);
  };

  // set new repo from drop down menu
  const handleRepoChange = (event) => {
    setRepo(event.target.value);
    dispatch(getRepoFiles(event.target.value));
  };

  const handleName = (event, newValue) => {
    setNodeName(event.target.value);
  };

  function renderRepos() {
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
  }

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
                  <Typography color="primary"> Push </Typography>
                  <img src={Github2} alt="" className="icon" />
                </div>
              </Box>

              <Box mx={1} sx={{ "box-shadow": 0 }}>
                <div className="loginButton github" onClick={() => logout()}>
                  <LogoutIcon> </LogoutIcon>
                </div>
              </Box>
            </Toolbar>
          </AppBar>

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
              printNodesArr: printNodesArr,
              getPRContent: getPRContent,
              handleName: handleName,
            }}
            data={{ repoData: repoData, selectedEL: selectedEL }}
          />
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div className="LandingPage">
          <div className="LogoDiv background">
            <Background className="Background" />
          </div>
          <div className="LogoDiv">
            <Logo className="Logo" />
          </div>
          <h1 className="CodeGram"> CodeGram</h1>
          <div className="GitHubButtonWrapper" onClick={login}>
            <GitHub className="GitHub" />
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
