import { Box } from "@mui/system";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import styled from "styled-components";
import { theme } from "../../Themes";
import { useEffect, useState } from "react";
import SimulationNode from "./SimulationNode";
import SimulationsControls from "./SimulationControls";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useReactFlow } from "react-flow-renderer";
import { FormControl } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSimulation } from "../../Redux/actions/simulationActions";

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function addStyles(nodeId, attrs) {
  let el = getElementByXpath(
    `.//*[@data-id='${nodeId}']//div[contains(@class, 'FileNode') or contains(@class, 'DashedShape')]`
  );

  const originalStyles = {};
  Object.keys(attrs).forEach((key) => {
    originalStyles[key] = el.style[key];
    el.style[key] = attrs[key];
  });

  return originalStyles;
}

function restoreStyles(nodeId, originalStyles) {
  let el = getElementByXpath(
    `.//*[@data-id='${nodeId}']//div[contains(@class, 'FileNode') or contains(@class, 'DashedShape')]`
  );

  Object.keys(originalStyles).forEach((key) => {
    el.style[key] = originalStyles[key];
  });
}

function renderSimulations(simulations) {
  var simList = [];
  simList.push(<option value={""}>Select Simulation to Start</option>);
  Object.keys(simulations).forEach((s) =>
    simList.push(<option value={s}>{s}</option>)
  );

  return simList;
}

function SimFiles({ simFiles, setSimFiles, current }) {
  function handleOnDragEnd(dragResult) {
    if (!dragResult.destination) {
      return;
    }
    const items = Array.from(simFiles);
    // remove from last location
    const [removed] = items.splice(dragResult.source.index, 1);
    // insert into new location
    items.splice(dragResult.destination.index, 0, removed);
    setSimFiles(items);
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="simFiles" style={{ overflowX: "hidden" }}>
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              position: "relative",
              width: "100%",
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginLeft: "10px",
            }}
          >
            {simFiles &&
              simFiles.map((nodeId, index) => (
                <Draggable key={nodeId} draggableId={nodeId} index={index}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <SimulationNode
                        nodeId={nodeId}
                        current={current}
                        style={{ width: "100%" }}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function SimulationsTab({ sourceFiles }) {
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [current, setCurrent] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(null);
  const [prev, setPrev] = useState(undefined);
  const [simFiles, setSimFiles] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [originalStylesBackup, setOriginalStylesBackup] = useState(null);
  const { getNodes } = useReactFlow();

  const { simulations } = useSelector((state) => state.simulations);

  console.log("simulations", simulations);

  const nodes = getNodes();
  const dispatch = useDispatch();

  // set new repo from drop down menu
  const selectSimulation = (event) => {
    dispatch(setCurrentSimulation(event.target.value));
    setSelectedSimulation(event.target.value);
  };

  useEffect(() => {
    if (simulations && selectedSimulation in simulations) {
      setSimFiles(simulations[selectedSimulation]);
    }
  }, [selectedSimulation, simulations]);

  useEffect(() => {
    if (isRunning) {
      try {
        const origStyles = {};

        simFiles.forEach((nodeId) => {
          //   document.body.querySelector(
          //     `[data-id=${nodeId}]`
          //   ).style.backgroundColor = "green";

          const nodeOriginalStyles = addStyles(nodeId, {
            border: `1px solid ${theme.palette.primary.pinkerPink}`,
            boxShadow: `5px 10px 20px ${theme.palette.primary.light}`,
          });

          origStyles[nodeId] = nodeOriginalStyles;
        });
        setOriginalStylesBackup(origStyles);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        simFiles.forEach((nodeId) => {
          // document.body.querySelector(
          //   `[data-id=${nodeId}]`
          // ).style.backgroundColor = "transparent";
          restoreStyles(nodeId, originalStylesBackup[nodeId]);
        });
        setOriginalStylesBackup(null);
      } catch (e) {
        console.log(e);
      }
    }
  }, [isRunning]);

  useEffect(() => {
    try {
      if (isRunning && current !== undefined) {
        const origCurStyles = addStyles(simFiles[current], {
          backgroundColor: theme.palette.primary.lighterPink,
          color: "white",
        });
        setCurrentStyle(origCurStyles);
        if (prev !== undefined && currentStyle) {
          restoreStyles(simFiles[prev], currentStyle);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [isRunning, current, prev]);

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 2, color: "white", "box-shadow": 0 }}>
        <FormControl fullWidth variant="outlined">
          <select
            className=""
            value={selectedSimulation}
            label="Repository"
            onChange={selectSimulation}
            placeholder="Choose Simulation"
            style={{
              borderRadius: "30px",
              outline: "none",
              height: "3vh",
              paddingLeft: "20px",
              border: "1px solid #ffaea6",
              color: "#FFAEA6",
              background: "transparent",
              appearance: "none",
              cursor: "pointer",
              boxShadow: !selectSimulation ? "-2.5px 4px 5px #c9c9c9" : "",
            }}
          >
            {renderSimulations(simulations)}
          </select>
        </FormControl>
      </Box>
      <SimulationsControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        prev={prev}
        setPrev={setPrev}
        current={current}
        setCurrent={setCurrent}
        simFiles={simFiles}
      />
      <div
        className="repoContainer"
        style={{
          position: "relative",
          maxHeight: "50vh",
          "overflow-y": "auto",
          "overflow-x": "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SimFiles
          simFiles={simFiles}
          setSimFiles={setSimFiles}
          current={simFiles ? simFiles[current] : null}
        />
      </div>
    </>
  );
}

export default SimulationsTab;
