import "../App.css";

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

// react
import { useState, useEffect } from "react";

// redux
import { useSelector } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// components
import SourceDocFile from "./SourceDocFile";
import axios from "axios";

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

// functions needed
function searchCodeBase() {
  return null;
}

function SourceDoc(props) {
  const state = useSelector((state) => state);
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  const [search, setSearch] = useState("search");
  const [curCode, setCurCode] = useState("Select a nnode to view file");
  // state for selected file
  const [selectedFile, setSelectedFile] = useState("");

  const [sourceFiles, setSourceFiles] = useState(null);
  const [path, setPath] = useState([]);
  const [pathComponent, setPathComponent] = useState(null);
  useEffect(() => {
    if (props.data.repo) {
      var homePath = {
        fileName: props.data.repo,
        dir: state.repoFiles.repoFiles[0],
        path: props.data.repo,
      };
      var newPath = [homePath];
      setPath(newPath);
      setSelectedFile(homePath);
    }
  }, [state.repoFiles]);

  // logic for updating our path variable
  useEffect(() => {
    var dir = null;
    var curPath = null;

    if (selectedFile) {
      if (selectedFile.dir) {
        dir = selectedFile.dir;
      } else {
        dir = selectedFile.contents;
      }

      if (path.includes(selectedFile)) {
        let curPath = [...path];
        curPath.length = path.indexOf(selectedFile) + 1;
        setPath(curPath);
      } else {
        if (selectedFile.contents) {
          setPath((path) => [...path, selectedFile]);
        }
      }

      if (dir !== undefined && dir !== null) {
        var repoList = [];
        const files = dir;
        for (var i = 0; i < files.length; i++) {
          repoList.push(
            <SourceDocFile
              addNode={props.functions.addNode}
              setSelectedFile={setSelectedFile}
              file={files[i]}
              selectedFile={selectedFile}
            />
          );
        }
        setSourceFiles(repoList);
      }
    }
  }, [state, selectedFile]);

  // separate for now as may need more logic here in future
  function pathClickHandler(curFile) {
    setSelectedFile(curFile);
  }

  // path component which is clickable
  function PathPart(props) {
    const { curFile, i } = props;
    return (
      <p
        key={i}
        onClick={() => {
          pathClickHandler(curFile);
        }}
      >
        {`/${curFile.fileName}`}
      </p>
    );
  }

  // render method to loop through path and create elements
  function renderPath(curPath) {
    var renderedPath = [];
    for (var i = 0; i < curPath.length; i++) {
      var curFile = curPath[i];
      renderedPath.push(<PathPart curFile={curFile} i={i} />);
    }
    return renderedPath;
  }

  // re render path component if path ever changes
  useEffect(() => {
    setPathComponent(renderPath(path));
  }, [path]);

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
    var searchVal = event.target.value;
    const found = props.data.repoData.data.find((file) =>
      file.name.startsWith(searchVal)
    );
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

  return (
    <Container
      className="sourceDocContainer"
      variant="absolute"
      sx={{ boxShadow: 10, m: 3, p: 3 }}
      style={{
        position: "fixed",
        top: "12vh",
        right: "1vw",
        width: "35vw",
        height: "80vh",
        "z-index": 0,
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        <Typography variant="h5" textAlign="left">
          Create Node
        </Typography>
        <TextField
          margin="dense"
          placeholder="Name.."
          inputProps={{ "aria-label": "search" }}
          onKeyPress={searchCodeBase}
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

        <Button
          variant="contained"
          color="primary"
          onClick={props.functions.printNodesArr}
          fullWidth
        >
          Save Diagram
        </Button>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDoc);
