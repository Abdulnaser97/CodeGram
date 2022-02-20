import "../App.css";
import "./SourceDoc.css";

// mui components
import { Box, Typography, Tabs, Tab } from "@mui/material";

// third party dependecnies
import PropTypes from "prop-types";
import { useStoreActions } from "react-flow-renderer";

// react
import { useState, useEffect } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// components
import SourceDocFile from "./SourceDocFile";
import TextEditor from "../components/TextEditor.js";
import DocsTab from "./DocsTab";
import CodeTab from "./CodeTab";
import SearchBar from "./SearchBar";

import axios from "axios";
import { Resizable } from "re-resizable";
import { errorNotification } from "../Redux/actions/notification";

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
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);

  const [curCode, setCurCode] = useState("Select a node to view file");

  // state for selected file
  const [sourceFiles, setSourceFiles] = useState(null);
  const [path, setPath] = useState([]);
  const [pathComponent, setPathComponent] = useState(null);
  const [SDContent, setSDContent] = useState(null);

  const [isEditing, setIsEditing] = useState("");

  // react flow functions
  const setSelectedElements = useStoreActions(
    (actions) => actions.setSelectedElements
  );
  // console.log(props.data.selectedEL)
  // resizeable state varaiables
  const [width, setWidth] = useState("40vw");
  const [height, setHeight] = useState("85vh");

  const dispatch = useDispatch();

  const { search, repository, fuse, homePath, selectedEL } = props.data;
  useEffect(() => {
    if (!state.repoFiles.repoFiles.isFetchingFiles) {
      props.functions.setOpenArtifact("");
      setSourceFiles(null);
      setPath([]);
      setPathComponent("...Loading");
      setSDContent("");
      setIsEditing("");
    }
  }, [props.data.repo, props.data.branch]);

  // change open artifact to be the file from react flow
  useEffect(() => {
    if (repository && selectedEL && selectedEL.data && selectedEL.data.path) {
      props.functions.setOpenArtifact(repository[selectedEL.data.path]);
    }
  }, [selectedEL]);

  // highlight node on canvas if exists -> may need optimizing. Indeed it needed :)
  useEffect(() => {
    try {
      if (props.data.openArtifact) {
        var el = state.nodes.nodesArr.find((node) =>
          node.data ? node.data.path === props.data.openArtifact.path : false
        );
        if (el) {
          setSelectedElements(el);
          props.functions.setSelectedEL(el);
        } else {
          setSelectedElements([]);
        }
      }
    } catch (e) {
      console.log(e);
      dispatch(errorNotification(`Error loading repo file`));
    }
  }, [props.data.openArtifact]);

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
            setOpenArtifact={props.functions.setOpenArtifact}
            file={repository[value[1].path]}
            openArtifact={props.data.openArtifact}
            selectedEL={props.data.selectedEL}
            addFileToNode={props.functions.addFileToNode}
          />
        );
      }
      setSourceFiles(repoList);
    } else {
      var repoList = [];
      const files = SDContent;
      for (var f of files) {
        repoList.push(
          <SourceDocFile
            addNode={props.functions.addNode}
            setOpenArtifact={props.functions.setOpenArtifact}
            file={repository[f.path]}
            openArtifact={props.data.openArtifact}
            selectedEL={props.data.selectedEL}
            addFileToNode={props.functions.addFileToNode}
          />
        );
      }
      setSourceFiles(repoList);
    }
  }, [SDContent, selectedEL, props.data.openArtifact, repository]);

  useEffect(() => {
    if (repository && homePath) {
      props.functions.setOpenArtifact(homePath);
      setPath([homePath]);
    }
  }, [homePath]);

  // logic for updating our path variable whenever the selected File changes
  useEffect(() => {
    if (props.data.openArtifact && repository) {
      // if new openArtifact iis on the path already
      if (path.includes(props.data.openArtifact)) {
        let curPath = [...path];
        curPath.length = path.indexOf(props.data.openArtifact) + 1;
        setPath(curPath);
      }
      //location exists and is a directory (has contents member)
      else if (
        repository[props.data.openArtifact.path] &&
        repository[props.data.openArtifact.path].contents
      ) {
        setPath(pathCreator(props.data.openArtifact.path.split("/")));
      }
      // else set path to parent directory of a openArtifact
      else {
        let curPath = props.data.openArtifact.path.split("/");
        var pathArr = curPath.slice(0, curPath.length);
        pathArr.length -= 1;
        setPath(pathCreator(pathArr));
      }
    }
  }, [props.data.openArtifact]);

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
      props.functions.setOpenArtifact(curFile);
    }
    // else find file from state
    else {
      props.functions.setOpenArtifact(repository[curFile.path]);
    }
  }

  // re render path component and directory if path ever changes
  useEffect(() => {
    // guard the use effect
    if (path.length && repository && props.data.openArtifact) {
      // create new path component
      setPathComponent(renderPath(path));
      // render home root
      if (
        (props.data.openArtifact.dir || path.length === 1) &&
        !props.data.openArtifact.path.includes("/")
      ) {
        setSDContent(homePath.dir);
      }
      // all other files and directories
      else {
        repository[path[path.length - 1].path] &&
          setSDContent(repository[path[path.length - 1].path].contents);
      }
    }
  }, [path]);

  //
  function renderFiles() {
    var files = [];
    if (selectedEL && selectedEL.data && selectedEL.data.parentNodes) {
      const f = selectedEL.data.parentNodes.map((pNode) => {
        <li className="SourceDocFile foldertype">hello</li>;
      });
    }
    return files;
  }

  // Tabs: handlers for state of tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!selectedEL) {
      console.log(`noELementSelected`);
      setValue(0);
    } else if (!selectedEL.data.label) {
      setValue(0);
    } else {
      setValue(2);
      if (props.data.openArtifact.url) {
        // calls node url to get file content
        axios
          .get(props.data.openArtifact.url)
          .then(function (response) {
            // handle success
            setCurCode(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            dispatch(errorNotification(`Error retrieving file content`));
          });
      } else {
        setCurCode("Select a nnode to view a file");
      }
    }
  }, [selectedEL]);

  useEffect(() => {
    props.functions.setTabValue(value);
  }, [value]);

  useEffect(() => {
    if (props.data.tabValue != value) setValue(props.data.tabValue);
  }, [props.data.tabValue]);

  // search method called whenevr search var changes
  useEffect(() => {
    props.functions.setOpenArtifact("");
    if (!search.length) {
      props.functions.setOpenArtifact(homePath);
      setPath([homePath]);
    } else if (fuse && search) {
      var results = fuse.search(search);
      var newResults = results.map((result) => result.item);
      setSDContent(newResults);
    }
  }, [search]);

  //if(props.data.isOpenSD){
  return (
    <div className={props.data.isOpenSD ? "openSD" : "hiddenSD"}>
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
            <Tab label="Repo" {...a11yProps(0)} />
            <Tab label="Code" {...a11yProps(1)} />
            <Tab label="Docs" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel
          value={value}
          index={0}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <SearchBar
            handleSearch={props.functions.handleSearch}
            setTabValue={props.functions.setTabValue}
          />
          <Box>
            <div className="pathContainer">
              {path.length ? pathComponent : "Root"}
            </div>
            <div
              className="repoContainer"
              style={{
                position: "relative",
                maxHeight: "50vh",
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
          style={{ height: "85%", overflowY: "scroll" }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            style={{
              position: "sticky",
              zIndex: 1,
            }}
          >
            {selectedEL && selectedEL.data ? selectedEL.data.label : selectedEL}
          </Typography>
          <CodeTab
            rawCode={curCode}
            fileName={
              selectedEL && selectedEL.data ? selectedEL.data.label : ""
            }
          />
        </TabPanel>
        <TabPanel value={value} index={2} style={{ overflowY: "scroll" }}>
          <DocsTab
            isEditing={isEditing}
            selectedEL={selectedEL}
            setIsEditing={setIsEditing}
            renderFiles={renderFiles}
            setElements={props.functions.setElements}
            setSelectedEL={props.functions.setSelectedEL}
          />
        </TabPanel>
      </Resizable>
    </div>
  );
  // } else {
  //   return null
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDoc);
