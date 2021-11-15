import React, { useCallback, useState, useRef } from "react";

import "./App.css";

import { Button, Box, Typography, Container, TextField } from "@mui/material";
import apiClient from "./api/apiClient";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ReactFlow, 
{ removeElements, 
  isEdge,
  getConnectedEdges,
  addEdge,
}from "react-flow-renderer";

import { connect } from "react-redux";
import { changeCount} from "./actions/counts";
import { bindActionCreators } from "redux";
import { COUNTER_CHANGE } from "./constants/index"; 
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
    'aria-controls': `simple-tabpanel-${index}`,
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
  // react flow
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => {
    console.log('click', element)
    setSelectedEL(element);
  }

  // state for search 
  const [search, setSearch] = useState('search'); 
  const [nodeName, setNodeName] = useState('nodeName'); 
  const [selectedEL, setSelectedEL] = useState(0);

  const count = props.count.count;

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
        linkedFiles: ['aa.py', 'gg.py', 'kookoo.py'],
        childNodes: ['da', 'de', 'do'],
        siblingNodes: ['ta', 'te', 'to'],
        parentNodes: ['pa', 'pe'],
        documentation: ['url1', 'url2'],
        description: '',
      },
      position: {
        x: 100,
        y: yPos.current,
      },
    };
    setElements((els) => els.concat(newNode));
  }, [setElements, nodeName]);


  // testers for api calls
  const ac = new apiClient("none");

  function login() {
    ac.githubAuth().then((data) => console.log(data));
  }

  function getPR() {
    ac.getPR().then((data) => console.log(data));
  }

  function getRepo() {
    ac.getRepo().then((data) => console.log(data));
  }

  function logoff() {
    ac.logoff().then((data) => console.log(data));
  }
  function helloWorld() {
    ac.getHello().then((data) => console.log(data));
  }

  // functions needed 
  function searchCodeBase(){
    return null 
  }


  // for tabs in the side menu 
  const [value, setValue] = React.useState(0);


  // handlers for state 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = (event, newValue) => {
    setSearch(event.target.value);
  };

  const handleName = (event, newValue) => {
    setNodeName(event.target.value);
  };

  const incrementCount = () => {
    console.log(`count: ${count}`);
    dispatch({type: COUNTER_CHANGE, payload: count+2});
  };

 
  return (
    <div className="App">
      <Box>
        <Typography variant="h3" m={2}>
          End point testers!
        </Typography>
        <Button variant="outlined" onClick={() => login()}>
          Login with Github!
        </Button>
        <Button variant="outlined" onClick={() => logoff()}>
          Logoff!
        </Button>
        <Button variant="outlined" onClick={() => getPR()}>
          Get PR!
        </Button>
        <Button variant="outlined" onClick={() => getRepo()}>
          Get Repo!
        </Button>
        <Button variant="outlined" onClick={() => helloWorld()}>
          Hello
        </Button>
        <Button variant="outlined" onClick={() => incrementCount()}>
          +
        </Button>
      </Box>
      <Typography variant="h3" m={2}>
        React-flow Test
      </Typography>


      <Box sx={{ display: 'flex', flexDirection: 'row'}}>
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

        <Container>
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
          <TabPanel value={value} index={0} sx = {{display:'flex', flexDirection:'column'}}>

            <Container>
              <Typography>
                Search to link a file!
              </Typography>
            <TextField
              margin="dense" 
              placeholder="Search.."
              inputProps={{ 'aria-label': 'search' }}
              onKeyPress={searchCodeBase}
              onChange={handleSearch}
            >
            </TextField>
            </Container>

            <Container>
              <Typography>
                Name node!
              </Typography>
            <TextField
              margin="dense" 
              placeholder="Name.."
              inputProps={{ 'aria-label': 'search' }}
              onKeyPress={searchCodeBase}
              onChange={handleName}
            >
            </TextField>
            </Container>


            <Container sx={{display:'flex', justifyContent:'space-around', mt:3}}>
            <Button variant="contained"onClick={()=>addNode()}>
              Create Node
            </Button>

            <Button variant="outlined" >
              Delete Node
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

    </div>
  );
}


const mapStateToProps = state => ({
  count: state.count,
});
const ActionCreators = Object.assign(
  {},
  changeCount,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export {connectedApp as App};