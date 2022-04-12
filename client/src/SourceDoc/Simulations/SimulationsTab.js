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
            {simFiles.map((nodeId, index) => (
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
  const [current, setCurrent] = useState(0);
  const [cuurentStyle, setCurrentStyle] = useState(null);
  const [prev, setPrev] = useState(undefined);
  const [simFiles, setSimFiles] = useState([
    "randomnode_1649613468513",
    "randomnode_1649613487157",
    "randomnode_1649613537384",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [originalStylesBackup, setOriginalStylesBackup] = useState(null);
  const { getNodes } = useReactFlow();

  const nodes = getNodes();

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
    if (isRunning && current !== undefined) {
      const origCurStyles = addStyles(simFiles[current], {
        backgroundColor: theme.palette.primary.lighterPink,
        color: "white",
      });
      setCurrentStyle(origCurStyles);
      if (prev !== undefined) {
        restoreStyles(simFiles[prev], cuurentStyle);
      }
    }
  }, [isRunning, current, prev]);

  return (
    <>
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
          current={simFiles[current]}
        />
      </div>
    </>
  );
}

export default SimulationsTab;
