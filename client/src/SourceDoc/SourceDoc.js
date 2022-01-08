import "../App.css";
import "./SourceDoc.css";
// mui components
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
  responsiveFontSizes,
} from "@mui/material";

// third party dependecnies
import PropTypes from "prop-types";
import { useStoreActions } from "react-flow-renderer";


// react
import { useState, useEffect } from "react";

// redux
import { useSelector } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// components
import SourceDocFile from "./SourceDocFile";
import TextEditor from "../components/TextEditor.js";

import axios from "axios";
import { fontWeight } from "@mui/system";
import { Resizable } from "re-resizable";


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


//// TODO: fix exiting out of search results by clicking on path.
//// Set SDContent back to previouus

function SourceDoc(props) {
  const state = useSelector((state) => state);

  //console.log(state)
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  
  const [curCode, setCurCode] = useState("Select a nnode to view file");

  // state for selected file
  const [openArtifact, setOpenArtifact] = useState("");
  const [sourceFiles, setSourceFiles] = useState(null);
  const [path, setPath] = useState([]);
  const [pathComponent, setPathComponent] = useState(null);
  const [SDContent, setSDContent] = useState(null);
  const setSelectedElements = useStoreActions(
    (actions) => actions.setSelectedElements
  );

  const [width, setWidth] = useState("40vw");
  const [height, setHeight] = useState("85vh");

  const { search, repository, fuse, homePath} = props.data 
  // change open artifact to beb the file from react flow
  useEffect(() => {
    if (repository)
      setOpenArtifact(repository[props.data.selectedEL.data.path]);
  }, [props.data.selectedEL]);

  // highlight node on canvas if exists -> may need optimizing
  useEffect(() => {
    if (openArtifact) {
      var el = state.nodes.nodesArr.find(
        (node) => node.data.path == openArtifact.path
      );
      if (el) {
        setSelectedElements(el);
        props.functions.setSelectedEL(el);
      } else {
        setSelectedElements([]);
        
      }
    }
  }, [openArtifact]);

  // set content of sourceDoc
  useEffect(() => {
    if (SDContent === null || SDContent === undefined) {
      return;
    } else if (SDContent[0] && SDContent[0].length > 1) {
      
        var repoList = [];
        const files = SDContent;
        for (const [key, value] of Object.entries(files)) {
          repoList.push(
            <SourceDocFile
              addNode={props.functions.addNode}
              setOpenArtifact={setOpenArtifact}
              file={value[1]}
              openArtifact={openArtifact}
              selectedEL={props.data.selectedEL}
            />
          );
        }
        setSourceFiles(repoList);
      
    } else {
 
        var repoList = [];
        const files = SDContent;
        for (const f of files) {
          repoList.push(
            <SourceDocFile
              addNode={props.functions.addNode}
              setOpenArtifact={setOpenArtifact}
              file={f}
              openArtifact={openArtifact}
              selectedEL={props.data.selectedEL}
            />
          );
        }
        setSourceFiles(repoList);
        
    }
  }, [SDContent, props.data.selectedEL, openArtifact]);

  useEffect(() => {
    if (repository && homePath) {
      setOpenArtifact(homePath);  
      setPath([homePath]);
    }
  }, [repository, homePath]);

  // logic for updating our path variable whenever the selected File changes
  useEffect(() => {
    if (openArtifact && repository) {
      // if new openArtifact iis on the path already
      if (path.includes(openArtifact)) {
        let curPath = [...path];
        curPath.length = path.indexOf(openArtifact) + 1;
        setPath(curPath);
      }
      //location exists and is a directory (has contents member)
      else if (
        repository[openArtifact.path] &&
        repository[openArtifact.path].contents
      ) {
        setPath(pathCreator(openArtifact.path.split("/")));
      }
      // else set path to parent directory of a openArtifact
      else {
        let curPath = openArtifact.path.split("/");
        var pathArr = curPath.slice(0, curPath.length);
        pathArr.length -= 1;
        setPath(pathCreator(pathArr));
      }
    }
  }, [state, openArtifact]);

  // create path state which is a list of path subsection name and the subpath
  function pathCreator(path) {
    var newPath = path;
    var toBePath = [homePath];
    for (var i = 0; i < newPath.length; i++) {
      toBePath.push({
        name: newPath[i],
        path: newPath.slice(0, i + 1).join("/"),
      });
    }
    return toBePath;
  }

  // render method to loop through path and create elements
  function renderPath(curPath) {
    var renderedPath = [];
    for (var i = 0; i < curPath.length; i++) {
      var curFile = curPath[i];
      renderedPath.push(<PathPart key={i} pathPart={curFile} />);
    }
    return renderedPath;
  }

  // path component which is clickable
  function PathPart(props) {
    const { pathPart } = props;
    return (
      <p
        onClick={() => {
          pathClickHandler(pathPart);
        }}
      >
        {` > ${pathPart.name}`}
      </p>
    );
  }

  // separate for now as may need more logic here in future
  function pathClickHandler(curFile) {
    // if clicked path has SDContent member (root directory)
 
      if (curFile.dir) {
        setOpenArtifact(curFile);

      }
      // else find file from state
      else {
        setOpenArtifact(repository[curFile.path]);

      }

    }

  // re render path component and directory if path ever changes
  useEffect(() => {
    // guard the use effect
    if (path.length && repository) {
      // create new path component
      setPathComponent(renderPath(path));
      // render home root
      if (
        (openArtifact.dir || path.length === 1) &&
        !openArtifact.path.includes("/")
      ) {
        setSDContent(homePath.dir);
      }
      // all other files and directories
      else {
        setSDContent(repository[path[path.length - 1].path].contents);
      }
    }
  }, [path]);

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


  useEffect(() => { ////////////////////////////////////////////////////////////////////////////////////////
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
  useEffect(() => {
    setOpenArtifact('')
    if (fuse && search) setSDContent(fuse.search(search));
  }, [search])
  //if(props.data.isOpenSD){
  return (
    <div className={props.data.isOpenSD ? "openSD" : "hiddenSD"}>
      {/* TODO: extract this compontnt to dashboard if team wants to do "terminal/key
      board command idea on one side of screen */}



      <Resizable
        size={{ width, height }}
        className="sourceDocContainer"
        style={{
          position: "fixed",
          top: "13vh",
          right: "1.5vw",
          width: "40vw",
          height: "90vh",
          "z-index": 0,
          borderRadius: "20px",
        }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
          setHeight(height + d.height);
        }}
      >
        <div
          className="SDMinimizeWrapper"
          onClick={() =>
            props.functions.setIsOpenSD((prevIsOpenSD) => !prevIsOpenSD)
          }
        >
          <div className="SDMinimize" />
        </div>
        <Box m={0}>
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
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box>
            <div className="pathContainer">
              {path.length ? pathComponent : "Root"}
            </div>
            <div
              className="repoContainer"
              style={{
                position: "relative",
                maxHeight:"50vh",
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
          <Typography
            variant="h4"
            fontWeight="bold"
            style={{
              position: "sticky",
              zIndex: 1,
            }}
          >
            {props.data.selectedEL.data.label}
          </Typography>
          <pre> {`${curCode}`} </pre>
        </TabPanel>
        <TabPanel value={value} index={2} style={{ overflow: "scroll" }}>
          <Box sx={{ disaply: "flex", flexDirection: "column" }}>
            <Typography variant="h5" fontWeight="bold">
              {props.data.selectedEL.data.label}
            </Typography>

            <Typography variant="h6">
              <a href={props.data.selectedEL.data.url}> source code link </a>
            </Typography>
            <Typography variant="h6">
              {'Write Notes'}
            </Typography> 
            <TextEditor/> 
            <Typography variant="h6" mt={2}>
              Parent Nodes <br />
              <Typography>
                {" "}
                {props.data.selectedEL.data.parentNodes}{" "}
              </Typography>
            </Typography>
            <Typography variant="h6" mt={2}>
              Child Nodes <br />
              <Typography> {props.data.selectedEL.data.childNodes} </Typography>
            </Typography>
            <Typography variant="h6" mt={2}>
              Configuration Files <br />
              <Typography>
                {" "}
                {props.data.selectedEL.data.parentNodes}{" "}
              </Typography>
            </Typography>
            <Typography variant="h6" mt={2}>
              Reference Docs <br />
              {renderFiles()}
              <Typography>
                {" "}
                {props.data.selectedEL.data.documentation}
              </Typography>
            </Typography>
          </Box>
        </TabPanel>
      </Resizable>
    </div>
  );
  // } else {
  //   return null
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDoc);
