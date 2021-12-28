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
  console.log(state)
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  const [search, setSearch] = useState("search");

  const [dir, setDir] = useState("")
  const [sourceFiles, setSourceFiles] = useState(null)
  const [path, setPath] = useState(null)
  
  useEffect(() => {
    if(props.data.selectedFile === null) {
      setDir(state.repoFiles.repoFiles[0])
    } else {
      if (props.data.selectedFile.contents){
        setDir(props.data.selectedFile.contents)
        setPath(props.data.selectedFile.path)
      }
    }
   // setPath(path => [...path, props.data.selectedFile.fileName])
    if (dir !== undefined && dir !== null) {
      var repoList = [];
      const files = dir;

      for (var i = 0; i < files.length; i++) {
     
        repoList.push(
          <SourceDocFile
            addNode={props.functions.addNode}
            setSelectedFile={props.functions.setSelectedFile}
            file={files[i]}
            selectedFile={props.data.selectedFile}
            setDir={setDir}
            setPath={setPath}
          />
        );
      }
      
      
      setSourceFiles(repoList);
    }

  }, [dir, state, props.data.selectedFile]);


  function renderPath(){
    var renderedPath = []
    for (const f of path){
      renderedPath.push(
        <p> </p> 
      )
    }
  }


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
    //console.log(found)
    setSearch(event.target.value);
  };


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
          <Typography variant="h6" textAlign="left" my={2}>
           {/* {path.length ? '/' + path[-1].contents : 'Root'}  */}
           {path ? '/' + path : 'Root'} 
          </Typography>
          <div 
            className='repoContainer'
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
        <pre> {`${props.data.curCode}`} </pre>
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
