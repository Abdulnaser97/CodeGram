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
import { useState } from "react";

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
  //console.log(state);
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  const [search, setSearch] = useState("search");


  function renderRepoContent(repoData) {
    if (repoData.repoFiles[0] !== undefined) {
      var repoList = [];
      const files = repoData.repoFiles[0];
      for (var i = 0; i < files.length; i++) {
        repoList.push(<SourceDocFile addNode={props.functions.addNode} setSelectedFile={props.functions.setSelectedFile}file={files[i]} />);
      }
      return repoList;
    }
  
    return null;
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

  var repoContent = renderRepoContent(state.repoFiles);
  return (
    <div className ='toolbar'> 
    <Container sx={{ boxShadow: 3,p: 3, minHeight:0.5}}>
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
        <Container m={3} sx={{ display: "flex", flexDirection: "row" }}>
 
          <Container>
            <Typography>Search to link a file</Typography>
            <TextField
              margin="dense"
              placeholder="Search.."
              inputProps={{ "aria-label": "search" }}
              onKeyPress={searchCodeBase}
              onChange={props.handleSearch}
            ></TextField>
          </Container>

          <Container>
            <Typography>Name node</Typography>
            <TextField
              margin="dense"
              placeholder="Name.."
              inputProps={{ "aria-label": "search" }}
              onKeyPress={searchCodeBase}
              onChange={props.functions.handleName}
            ></TextField>
          </Container>
        </Container>

        <Box my={3}>
          <Typography variant="h5" textAlign="left">
            Repository Content
          </Typography>
          {repoContent}
        </Box>

        <Container
          m={5}
          sx={{ display: "flex", justifyContent: "space-around"}}
        >
          <Button variant="contained" onClick={props.functions.addNode}>
            Create Node
          </Button>

          <Button variant="outlined">Delete Node</Button>
          <Button variant="outlined" onClick={props.functions.printNodesArr}>
            Save
          </Button>

          <Button variant="outlined" onClick={props.functions.getPRContent}>
            Get PR
          </Button>
        </Container>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Let's connect to github first!
      </TabPanel>
      <TabPanel value={value} index={2}>
        {JSON.stringify(props.data.selectedEL)}
      </TabPanel>
    </Container>
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDoc);
