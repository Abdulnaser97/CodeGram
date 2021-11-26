import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";

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

export function SourceDoc(props) {
  const state = useSelector((state) => state);
  console.log(state);
  // Tabs: for tabs in the side menu
  const [value, setValue] = useState(0);
  // state for search
  const [search, setSearch] = useState("search");

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

        <Container
          sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}
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
  );
}
