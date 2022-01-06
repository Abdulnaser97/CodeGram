import "../App.css";
import "./SourceDoc.css"
// mui components
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
} from "@mui/material";

// third party dependecnies
import PropTypes from "prop-types";
import { useStoreActions } from 'react-flow-renderer';
import Fuse from 'fuse.js'

// react
import { useState, useEffect } from "react";

// redux
import { useSelector } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// components
import SourceDocFile from "./SourceDocFile";
import axios from "axios";

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    "name"
  ]
};

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



function SourceDoc(props) {
  const state = useSelector((state) => state);
  const repository = state.repoFiles.repoFiles[0]

  //console.log(state)
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  const [search, setSearch] = useState("search");
  const [curCode, setCurCode] = useState("Select a nnode to view file");

  // state for selected file
  const [openArtifact, setOpenArtifact] = useState("");
  const [sourceFiles, setSourceFiles] = useState(null)
  const [path, setPath] = useState([])
  const [homePath, setHomePath] = useState(null)
  const [pathComponent, setPathComponent] = useState(null)
  const [fuse, setFuse] = useState(null)
  const [SDContent, setSDContent] = useState (null)
  const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements); 
  

  // change open artifact to beb the file from react flow
  useEffect(() => {
    if (repository)
      setOpenArtifact(repository[props.data.selectedEL.data.path])
  }, [props.data.selectedEL])

  // highlight node on canvas if exists -> may need optimizing 
  useEffect(() => {
    if (openArtifact){
      var el = state.nodes.nodesArr.find(node => node.data.path == openArtifact.path)
      if (el){
        setSelectedElements(el)
        props.functions.setSelectedEL(el)
      }
    }
  }, [openArtifact])
 
  // set content of sourceDoc 
  useEffect(() => {
    if (SDContent === null || SDContent === undefined){
      return
    }
    else if (SDContent[0] && SDContent[0].length > 1) { 
      if (SDContent !== undefined && SDContent !== null) {
        var repoList = [];
        const files = SDContent;
        for (const [key,value] of Object.entries(files)){
          repoList.push(
            <SourceDocFile
              addNode={props.functions.addNode}
              setOpenArtifact={setOpenArtifact}
              file={value[1]}
              openArtifact={openArtifact}
            />
          );
        }
        setSourceFiles(repoList);
      }
    }
    else {
      if (SDContent !== undefined && SDContent !== null) {
        var repoList = [];
        const files = SDContent;
        for (const f of files){
          repoList.push(
            <SourceDocFile
              addNode={props.functions.addNode}
              setOpenArtifact={setOpenArtifact}
              file={f}
              openArtifact={openArtifact}
            />
          );
        }
        setSourceFiles(repoList);
      }
    } 
  }, [SDContent, props.data.selectedEL, openArtifact])
  
  useEffect(() => {
    if (props.data.repo && repository ) {
      var homeDir = []
      // push home directory files into home path 
      for (const [key,val] of Object.entries(repository)){
        key.split('/').length === 1 && homeDir.push(val)
      }

      var hPath = {
        name: props.data.repo,
        dir: homeDir,
        path: props.data.repo,
      }
      // IMPORTANT: Fuse search object currently created here 
      // May be good to move to state so it can be a shared function to 
      // search through the react flow nodes array or the repo files array
      const myFuse = new Fuse(Object.values(repository), options);
      setHomePath(hPath)
      setPath([hPath])
      setOpenArtifact(hPath)
      setFuse(myFuse)
    }
  }, [props.data.repo, state.repoFiles.repoFiles]);

  // logic for updating our path variable whenever the selected File changes
  useEffect(() => {
    if (openArtifact && repository) {
      // if new openArtifact iis on the path already 
      if (path.includes(openArtifact)) {
        let curPath = [...path]
        curPath.length = path.indexOf(openArtifact) + 1
        setPath(curPath)
      }
      //location exists and is a directory (has contents member) 
       else if (repository[openArtifact.path].contents) {
          setPath(pathCreator(openArtifact.path.split("/")))
      } 
      // else set path to parent directory of a openArtifact
      else {
        let curPath = openArtifact.path.split("/")
        var pathArr = curPath.slice(0,curPath.length)
        pathArr.length -= 1 
        setPath(pathCreator(pathArr))
      }
    }
  }, [state, openArtifact]);

  // create path state which is a list of path subsection name and the subpath
  function pathCreator(path){
    var newPath = path
    var toBePath = [homePath] 
    for (var i = 0; i < newPath.length; i++){
      toBePath.push( 
        {
          name: newPath[i], 
          path: newPath.slice(0, i+1).join("/")
        }
      )
    }
    return toBePath
  }

  // render method to loop through path and create elements
  function renderPath(curPath) {
    var renderedPath = [];
    for (var i = 0; i < curPath.length; i++) {
      var curFile = curPath[i]
      renderedPath.push(
        <PathPart 
          key={i}
          pathPart={curFile}
        />
      );
    }
    return renderedPath;
  }

  // path component which is clickable 
  function PathPart(props) {
    const { pathPart } = props;
    return (
      <p onClick={() => {
        pathClickHandler(pathPart)
      }}
      >
        {` > ${pathPart.name}`}
      </p>
    )
  }

  // separate for now as may need more logic here in future
  function pathClickHandler(curFile) {
    // if clicked path has SDContent member (root directory)
    if (curFile.dir){
      setOpenArtifact(curFile)
    }
    // else find file from state 
    else {
      setOpenArtifact(repository[curFile.path])
    }
  }

  // re render path component and directory if path ever changes
  useEffect(() => {
    // guard the use effect 
    if (path.length && repository){
      // create new path component 
      setPathComponent(renderPath(path))
      // render home root 
      if (
        (openArtifact.dir || path.length === 1) 
          && 
        !openArtifact.path.includes("/")) 
      {
        setSDContent(homePath.dir)
      }
      // all other files and directories
      else { 
        setSDContent(repository[path[path.length-1].path].contents)
      }
    }
  }, [path])

  // 
  function renderFiles() {
    var files = [];
    if (props.data.selectedEL.data.parentNodes) {
      const f = props.data.selectedEL.data.parentNodes.map((pNode) => {
        <li className="SourceDocFile foldertype">hello</li>;
      });
    }
    return files;
  }

  // Tabs: handlers for state of tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = (event, newValue) => {
    // set null during search so any clicks after a serach still trigger rerender
    setOpenArtifact(null)
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (props.data.selectedEL.data.url !== undefined) {
      // calls node url to get file content
      axios
        .get(props.data.selectedEL.data.url)
        .then(function (response) {
          // handle success
          setCurCode(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  }, [props.data.selectedEL]);

// search method
function searchCodeBase() {
  setSDContent(fuse.search(search)) 
}
  if(props.data.isOpenSD){
  return (
    <Container
      className="sourceDocContainer"
      variant="absolute"
      style={{
        position: "fixed",
        padding:"2vh",
        top: "7vh",
        right: "0",
        width: "42vw",
        height: "95vh",
        "z-index": 0,
  
      }}
    >
      <Box sx={{ }}>
        <Tabs
          TabIndicatorProps={{
            style: {
              backgroundColor: "#FFAEA6",
            },
          }}
          textColor="primary"
          indicatorColor="primary"
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
        sx={{ display: "flex", flexDirection: "column"}}
      >
        <TextField
          margin="dense"
          placeholder="Search your repository!"
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearch}
          onKeyPress={searchCodeBase}
          fullWidth
        ></TextField>
        <Typography variant="h6" textAlign="left">
          Create Node
        </Typography>
        <TextField
          margin="dense"
          placeholder="Name.."
          inputProps={{ "aria-label": "search" }}
          onChange={props.functions.handleName}
          fullWidth
        ></TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={props.functions.addNode}
          fullWidth
        >
          Create Node
        </Button>
        <Box my={3}>
          <div className="pathContainer">
            {path.length ? pathComponent : "Root"}
          </div>
          <div
            className="repoContainer"
            style={{
              position: "relative",
              height: "35vh",
              "overflow-y": "scroll",
            }}
          >
            {sourceFiles}
          </div>
        </Box>

      </TabPanel>
      <TabPanel
        value={value}
        index={1}
        style={{ height: "90%", overflow: "scroll" }}
      >
        <pre> {`${curCode}`} </pre>
      </TabPanel>
      <TabPanel value={value} index={2} style={{ overflow: "scroll" }}>
        <Box sx={{ disaply: "flex", flexDirection: "column" }}>
          <Typography variant="h4" fontWeight="bold">
            {props.data.selectedEL.data.label}
          </Typography>
          <Typography variant="h5">
            <a href={props.data.selectedEL.data.url}> source code link </a>
          </Typography>
          <Typography variant="h5" mt={2}>
            Parent Nodes <br />
            <Typography> {props.data.selectedEL.data.parentNodes} </Typography>
          </Typography>
          <Typography variant="h5" mt={2}>
            Child Nodes <br />
            <Typography> {props.data.selectedEL.data.childNodes} </Typography>
          </Typography>
          <Typography variant="h5" mt={2}>
            Configuration Files <br />
            <Typography> {props.data.selectedEL.data.parentNodes} </Typography>
          </Typography>
          <Typography variant="h5" mt={2}>
            Reference Docs <br />
            {renderFiles()}
            <Typography> {props.data.selectedEL.data.documentation}</Typography>
          </Typography>
        </Box>
      </TabPanel>
    </Container>
  
  );
  } else {
    return null 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDoc);
