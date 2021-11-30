// styling 
import "./App.css";

// assets 
import Github from "./img/github.png";

// react 
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

// redux 
import ReactFlow, { removeElements, addEdge } from "react-flow-renderer";
import { connect } from "react-redux";
import { addNodeToArray } from "./Redux/actions/nodes";
import { useDispatch } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "./Redux/configureStore";
import { getRepoFiles } from "./Redux/actions/repoFiles";

// custom components 
import SourceDoc from "./SourceDoc/SourceDoc";
import MyNavigationBar from "./components/MyNavigationBar";

// pages 
import { Landing }  from "./pages/Landing";

const getNodeId = () => `randomnode_${+new Date()}`;

const initialElements = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "Project Root" },
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
  const [nodeName, setNodeName] = useState("nodeName");
  // Selected node
  const [selectedEL, setSelectedEL] = useState(0);
  // state for selected file 
  const [selectedFile, setSelectedFile] = useState(''); 
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
  const addNode = useCallback((file) => {
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
      },
      position: {
        x: 100,
        y: yPos.current,
      },
    };
    dispatch(addNodeToArray(newNode));
    setElements((els) => els.concat(newNode));
  }, [setElements, nodeName, dispatch, selectedFile]);


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
      <div className="App">

        {/* navbar component written but has weird bug  */}

        {/* <MyNavigationBar
          functions={{
            handleRepoChange: handleRepoChange,
            renderRepos: renderRepos,
            logout: logout

          }}
          data={{ repo: repo }}
       />  */}
        
        <AppBar position="sticky" style={{ background: "black" }}>
          <Toolbar>
            <MenuItem sx={{ flexGrow: 3 }}>
              <Typography variant="h3">CodeGram</Typography>
            </MenuItem>
            <Box> <Typography> user: {user.username}</Typography></Box>
            <Box sx={{ flexGrow: 1, p: 2, color: "white" }}>
              <FormControl fullWidth variant="outlined">
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
        
        {/* dashboard should be in its own file at some point  */}
        
        <div className='dashboard'>
            <div className="canvas">
              <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={setRfInstance}
                onElementClick={onElementClick}
                />
            </div>
     
          <SourceDoc
            functions={{
              addNode: addNode,
              printNodesArr: printNodesArr,
              getPRContent: getPRContent,
              handleName: handleName,
              setSelectedFile:setSelectedFile
            }}
            data={{ repo: repo, repoData: repoData, selectedEL: selectedEL, selectedFile:selectedFile}}
          />
        </div>
      </div>
    );
  } else {
    return (
      <Landing/> 
    );
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
