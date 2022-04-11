import "../App.css";
import "./SourceDoc.css";

// third-party components
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { Resizable } from "re-resizable";

// third party dependecnies
import PropTypes from "prop-types";

// react
import { useState, useEffect } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

//actions
import { updateRepoFileCodeContent } from "../Redux/actions/repoFiles";
import { errorNotification } from "../Redux/actions/notification";

// components
import SourceDocFile from "./SourceDocFile";
import TextEditor from "../components/TextEditor.js";
import DocsTab from "./DocsTab";
import CodeTab from "./CodeTab";
import SearchBar from "./SearchBar";

import axios from "axios";
import { getRepo } from "../api/apiClient";

import { useReactFlow } from "react-flow-renderer";

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
    "overflow-y": "auto",
    "max-height": "85%",
  };
}

function SourceDoc(props) {
  const { state } = useSelector((state) => {
    return { state: state };
  });
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // console.log(props.data.nodes);
  const [curCode, setCurCode] = useState("Select a node to view file");

  // state for selected file
  const [sourceFiles, setSourceFiles] = useState(null);
  const [path, setPath] = useState([]);
  const [pathComponent, setPathComponent] = useState(null);
  const [SDContent, setSDContent] = useState(null);
  const [isMaxSD, setIsMaxSD] = useState(false);
  const [isEditing, setIsEditing] = useState("");

  // console.log(props.data.selectedEL)
  // resizeable state varaiables
  const [width, setWidth] = useState("35vw");
  const [height, setHeight] = useState("80vh");

  // only updates if selectedEL is not text
  const [filteredSelectedEL, setFilteredSelectedEL] = useState(null);

  const { getNodes } = useReactFlow();

  const dispatch = useDispatch();

  const { search, repository, fuse, homePath, selectedEL } = props.data;
  useEffect(() => {
    if (!state.repoFiles.isFetchingFiles) {
      props.functions.setOpenArtifact("");
      setSourceFiles(null);
      setPath([]);
      setPathComponent("...Loading");
      setSDContent("");
      setIsEditing("");
    }
  }, [props.data.repo, props.data.branch, state.repoFiles.isFetchingFiles]);

  // change open artifact to be the file from react flow
  useEffect(() => {
    if (
      repository &&
      filteredSelectedEL &&
      filteredSelectedEL.data &&
      filteredSelectedEL.data.path
    ) {
      props.functions.setOpenArtifact(repository[filteredSelectedEL.data.path]);
    }
  }, [filteredSelectedEL]);

  // console.log(props.data.nodes);

  // highlight node on canvas if exists -> may need optimizing. Indeed it needed :)
  useEffect(() => {
    try {
      if (props.data.openArtifact) {
        var el = getNodes().find((node) =>
          node.data ? node.data.path === props.data.openArtifact.path : false
        );

        if (el) {
          console.log(el);
          props.functions.setSelectedEL(el);
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
            selectedEL={filteredSelectedEL}
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
            selectedEL={filteredSelectedEL}
            addFileToNode={props.functions.addFileToNode}
            nodes={props.data.nodes}
          />
        );
      }
      setSourceFiles(repoList);
    }
  }, [
    SDContent,
    filteredSelectedEL,
    props.data.openArtifact,
    repository,
    state.repoFiles.isFetchingFiles,
    props.data.nodes,
  ]);

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
    if (
      filteredSelectedEL &&
      filteredSelectedEL.data &&
      filteredSelectedEL.data.parentNodes
    ) {
      const f = filteredSelectedEL.data.parentNodes.map((pNode) => {
        <li className="SourceDocFile foldertype">hello</li>;
      });
    }
    return files;
  }

  // Tabs: handlers for state of tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.functions.setTabValue(newValue);
  };

  useEffect(() => {
    try {
      if (
        !filteredSelectedEL ||
        !selectedEL ||
        selectedEL.data.type === "Text"
      ) {
        // setValue(0);
      }
      // only set code in Code Tab if openArtifact is a file
      else if (filteredSelectedEL.data.code) {
        console.log("data.code");
        setCurCode(filteredSelectedEL.data.code);
      } else if (!selectedEL.data.label) {
        // setValue(0);
        setCurCode("This node has no code linked!");
      } else if (filteredSelectedEL.data.label) {
        // setValue(2);
        const path = props.data.selectedEL
          ? props.data.selectedEL.data.path
          : null;

        // only set code in Code Tab if openArtifact is a file
        if (props.data.openArtifact && props.data.openArtifact.type == "file") {
          // do GET request if file code hasn't been retrieved yet
          if (
            path &&
            !state.repoFiles.repoFiles[path].code &&
            state.repoFiles.repoFiles[path].url.includes("?token")
          ) {
            // calls node url to get file content
            Promise.resolve(getRepo(props.data.repo, path, props.data.branch))
              .then((response) => {
                console.log("GET file contents response", response);
                const download_url = response.data.download_url;
                axios
                  .get(download_url)
                  .then(function (response) {
                    // handle success
                    // populate repoFile.data[path].code with response.data, so don't have to do multiple GET requests again
                    dispatch(updateRepoFileCodeContent(path, response.data));
                    setCurCode(response.data);
                  })
                  .catch((error) => {
                    console.log(error);
                    dispatch(
                      errorNotification(`Github error retrieving file content`)
                    );
                  });
              })
              .catch((error) => {
                console.log("GET file contents on select error", error);
                dispatch(errorNotification(`Error retrieving file content`));
              });
          }
          // public repos
          else if (
            path &&
            !state.repoFiles.repoFiles[path].code &&
            !state.repoFiles.repoFiles[path].url.includes("?token")
          ) {
            axios
              .get(props.data.openArtifact.url)
              .then(function (response) {
                // handle success
                // populate repoFile.data[path].code with response.data, so don't have to do multiple GET requests again
                dispatch(updateRepoFileCodeContent(path, response.data));
                setCurCode(response.data);
              })
              .catch((error) => {
                setCurCode(null);
                console.log(error);
                dispatch(
                  errorNotification(`Github error retrieving file content`)
                );
              });
          } else {
            console.log(
              "Already retrieved file code contents, calling from store"
            );

            if (path) {
              console.log("PATH!");
              setCurCode(state.repoFiles.repoFiles[path].code);
            } else {
              setCurCode("This node has no code linked!");
            }
          }
        } else {
          console.log("not a file");
          setCurCode("Select a node to view a file");
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }, [filteredSelectedEL, selectedEL]);

  useEffect(() => {
    if (props.data.tabValue != value) setValue(props.data.tabValue);
  }, [props.data.tabValue]);

  // search method called whenever search var changes
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

  // Updated filteredSelectedEL only if selectedEL is not Text
  useEffect(() => {
    if (props.data.selectedEL && props.data.selectedEL.data.type !== "Text") {
      setFilteredSelectedEL(props.data.selectedEL);
    }
  }, [props.data.selectedEL]);

  //if(props.data.isOpenSD){
  return (
    <div className={props.data.isOpenSD ? "openSD" : "hiddenSD"}>
      <Resizable
        size={{ width, height }}
        className="sourceDocContainer"
        style={{
          position: "absolute",
          top: isMaxSD ? "0" : "13vh",
          height: isMaxSD ? "100vh" : "",
          right: isMaxSD ? "0" : "1.5vw",
          "border-radius": isMaxSD ? "0" : "20px",
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
        <div
          className="SDMaximizeWrapper"
          onClick={() => {
            if (!isMaxSD) setHeight("100vh");
            else setHeight("80vh");
            setIsMaxSD((prevIsMaxSD) => !prevIsMaxSD);
          }}
        >
          <div className="SDMaximize" />
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
                "overflow-y": "auto",
              }}
            >
              {sourceFiles}
            </div>
          </Box>
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ height: "85%", overflowY: "auto" }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            style={{
              position: "sticky",
              zIndex: 1,
            }}
          >
            {filteredSelectedEL && filteredSelectedEL.data
              ? filteredSelectedEL.data.label
              : filteredSelectedEL}
          </Typography>
          <CodeTab
            rawCode={curCode}
            fileName={
              filteredSelectedEL && filteredSelectedEL.data
                ? filteredSelectedEL.data.label
                : ""
            }
            fileNode={filteredSelectedEL ? filteredSelectedEL : ""}
            addLineNode={props.functions.addLineNode}
            height={height}
            width={width}
          />
        </TabPanel>
        <TabPanel value={value} index={2} style={{ overflow: "auto" }}>
          <DocsTab
            isEditing={isEditing}
            selectedEL={selectedEL}
            openArtifact={props.data.openArtifact}
            setIsEditing={setIsEditing}
            renderFiles={renderFiles}
            setNodes={props.functions.setNodes}
            setEdges={props.functions.setEdges}
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
