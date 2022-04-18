import "../SourceDoc.css";
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
import { FormControl, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSimulation } from "../../Redux/actions/simulationActions";
import { realPos } from "../../canvas/utils";
import CodeTab from "../CodeTab";

const SimulationContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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

function SimulationsTab({
  sourceFiles,
  setSelectedEL,
  createCustomChange,
  selectedEL,
  rawCode,
  fileName,
  fileNode,
  addLineNode,
  setIsMaxSD,
}) {
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [current, setCurrent] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(null);
  const [prev, setPrev] = useState(0);
  const [simFiles, setSimFiles] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [originalStylesBackup, setOriginalStylesBackup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { getNodes, getNode, fitBounds } = useReactFlow();
  const rf = useReactFlow();

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
        let nodeToSelect = getNode(simFiles[current]);
        setSelectedEL(nodeToSelect);
        if (nodeToSelect) {
          var realNodePos = realPos(nodeToSelect, rf);

          // setCenter(x, y, { zoom, duration: 1000 });
          fitBounds(
            {
              x: realNodePos.position.x + nodeToSelect.width / 2,
              y: realNodePos.position.y,
              width: nodeToSelect.data.width * 4,
              height: nodeToSelect.data.height * 4,
            },
            {
              padding: 2,
              duration: 1000,
            }
          );
        }

        if (prev !== undefined && currentStyle) {
          restoreStyles(simFiles[prev], currentStyle);
        }
      } else {
        if (currentStyle) {
          restoreStyles(simFiles[current], currentStyle);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [isRunning, current, prev]);

  return (
    <SimulationContainer>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          color: "white",
          "box-shadow": 0,
          paddingBottom: "20px",
          width: "90%",
        }}
      >
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
              height: "35px",
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
        setSelectedEL={setSelectedEL}
        createCustomChange={createCustomChange}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setIsMaxSD={setIsMaxSD}
      />
      {isEditing ? (
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
      ) : selectedEL?.data?.wiki ? (
        <div
          style={{
            position: "relative",
            marginLeft: "5%",
            width: "90%",
            height: "30vh",
            marginBottom: "5vh",
          }}
        >
          {" "}
          <Typography my={1} variant="h8" color="primary">
            Wiki
          </Typography>
          <div
            className="containerNoScrollBar"
            style={{
              position: "relative",
              height: "100%",
              border: "1px solid #ffaea6",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <div
              className="containerNoScrollBar"
              style={{ positon: "relative", width: "90%", height: "97%" }}
              dangerouslySetInnerHTML={{
                __html: selectedEL.data.wiki,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="emptyWikiButton" style={{ marginBottom: "10%" }}>
          <Typography variant="h6" fontWeight={"thin"}>
            {" "}
            + Add Wiki in Docs Tab
          </Typography>
        </div>
      )}
      <div
        style={{
          position: "relative",
          marginLeft: "5%",
          width: "90%",
          height: "30vh",
        }}
      >
        <Typography my={1} variant="h8" color="primary">
          Source Code
        </Typography>
        <div
          style={{
            position: "relative",
            height: "30vh",
            border: "1px solid #ffaea6",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CodeTab
            rawCode={rawCode}
            fileName={fileName}
            fileNode={fileNode}
            addLineNode={addLineNode}
            styleProp={{
              position: "relative",
              width: "95%",
              height: "27vh",
              overflow: "auto",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </SimulationContainer>
  );
}

export default SimulationsTab;
