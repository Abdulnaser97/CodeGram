import "./App.css";
import Github from "./img/github.png";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  invalidateToken,
  getRepo,
  getPR,
  getUser,
  getRepos,
} from "./api/apiClient";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Button,
  Box,
  Typography,
  Container,
  TextField,
  AppBar,
  Toolbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ReactFlow, {
  removeElements,
  isEdge,
  getConnectedEdges,
  addEdge,
} from "react-flow-renderer";

import { connect } from "react-redux";
import { changeCount } from "./actions/counts";
import { addNodeToArray, deleteNodeFromArray } from "./actions/nodes";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getNodeId = () => `randomnode_${+new Date()}`;

const initialElements = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "Input Node" },
    position: { x: 100, y: 0 },
  },
];

function App(props) {
  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);
  const [repos, setRepos] = useState([]);
  const [repo, setRepo] = useState("");
  const [repoData, setRepoData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  var repoChoiceList = [];
  // state for search
  const [search, setSearch] = useState("search");
  const [nodeName, setNodeName] = useState("nodeName");
  const [selectedEL, setSelectedEL] = useState(0);

  // state for flash messages
  const [setOpenFail, openFail] = useState(false);
  const [setOpenSucc, openSucc] = useState(false);

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

  // const handleCloseFail = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenFail(false);
  // };

  // const handleCloseSucc = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenSucc(false);
  // };

  // redux
  const count = props.count.count;
  const nodesArr = props.nodes.nodesArr;
  const dispatch = useDispatch();

  // add node function
  const addNode = useCallback(() => {
    var label = nodeName;
    const newNode = {
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
    };
    dispatch(addNodeToArray(newNode));
    setElements((els) => els.concat(newNode));
  }, [setElements, nodeName]);

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
  };


  function renderRepos() {
    var repoNames = [];
    var repoChoiceItems = [];

    if (repos.data !== undefined) {
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

  // functions needed
  function searchCodeBase() {
    return null;
  }

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

  //
  useEffect(async () => {
    const newRepo = await getRepo(repo);
    setRepoData(newRepo)
  }, [repo]);

  // for tabs in the side menu
  const [value, setValue] = React.useState(0);

  // handlers for state
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = (event, newValue) => {
    var searchVal = event.target.value;
    console.log(repoData)
    const found = repoData.data.find(file => file.name.startsWith(searchVal));
    //console.log(found) 
    setSearch(event.target.value);
  };

  const handleName = (event, newValue) => {
    setNodeName(event.target.value);
  };

  const incrementCount = () => {
    console.log(`count: ${count}`);
    dispatch(changeCount(count + 4));
    // dispatch({type: COUNTER_CHANGE, payload: count+2});
  };

  const decrementCount = () => {
    console.log(`count: ${count}`);
    dispatch(changeCount(count - 4));
    // dispatch({type: COUNTER_CHANGE, payload: count+2});
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


  if (loggedIn) {
    return (
      <div className="App">
        <AppBar position="sticky" style={{ background: "black" }}>
          <Toolbar>
            <MenuItem sx={{ flexGrow: 3 }}>
              <Typography variant="h5">CodeGram</Typography>
            </MenuItem>
            <Box sx={{ flexGrow: 1, p: 2, color:'white'}}>
            
              <FormControl
                fullWidth
                variant="outlined"
             
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={repo}
                  label="Repository"
                  onChange={handleRepoChange}
                  sx={{ backgroundColor: "#E4E6EB" }}
                  displayEmpty
                >
                  {renderRepos()}
                </Select>
              </FormControl>
            </Box>

            <Box mx={1}>
              <div className="loginButton github">
                <Typography> Push </Typography>
                <img src={Github} alt="" className="icon" />
              </div>
            </Box>

            <Box mx={1}>
              <div className="loginButton github" onClick={() => logout()}>
                <LogoutIcon> </LogoutIcon>
              </div>
            </Box>
          </Toolbar>
        </AppBar>

        <Typography variant="h3" m={8}>
          Welcome to CodeGram demo {user.username}!
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Container>
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

          <Container variant="absolute" sx={{ boxShadow: 3, m: 3, p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab label="Tools" {...a11yProps(0)} />
                <Tab label="Code" {...a11yProps(1)} />
                <Tab label="Documentation" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel
              value={value}
              index={0}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Container>
                <Typography>Search to link a file!</Typography>
                <TextField
                  margin="dense"
                  placeholder="Search.."
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={searchCodeBase}
                  onChange={handleSearch}
                ></TextField>
              </Container>

              <Container>
                <Typography>Name node!</Typography>
                <TextField
                  margin="dense"
                  placeholder="Name.."
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={searchCodeBase}
                  onChange={handleName}
                ></TextField>
              </Container>

              <Container
                sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}
              >
                <Button variant="contained" onClick={() => addNode()}>
                  Create Node
                </Button>

                <Button variant="outlined">Delete Node</Button>
                <Button variant="outlined" onClick={() => printNodesArr()}>
                  Save
                </Button>

                <Button variant="outlined" onClick={() => getPRContent()}>
                  Get PR!
                </Button>
                <Button variant="outlined" onClick={() => decrementCount()}>
                  -
                </Button>
                <Button variant="outlined" onClick={() => incrementCount()}>
                  +
                </Button>
              </Container>
            </TabPanel>
            <TabPanel value={value} index={1}>
              Let's connect to github first!
            </TabPanel>
            <TabPanel value={value} index={2}>
              {JSON.stringify(selectedEL)}
            </TabPanel>
          </Container>
        </Box>

        {/* flash messages */}
        {/* <Snackbar open={openFail} autoHideDuration={6000} onClose={handleCloseFail}>
        <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
          This is an error message!;
        </Alert>
      </Snackbar>

      <Snackbar open={openSucc} autoHideDuration={6000} onClose={handleCloseSucc}>
        <Alert onClose={handleCloseSucc} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
      </div>
    );
  } else {
    return (
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
}

const mapStateToProps = (state) => ({
  count: state.count,
  nodes: state.nodes,
});
const ActionCreators = Object.assign(
  {},
  changeCount,
  addNodeToArray,
  deleteNodeFromArray
);
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
