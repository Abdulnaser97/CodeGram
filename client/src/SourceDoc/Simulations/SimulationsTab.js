import { Box } from "@mui/system";
import styled from "styled-components";
import { theme } from "../../Themes";
import { useState } from "react";
import SimulationNode from "./SimulationNode";
import arrayMove from "array-move";
import SimulationsControls from "./SimulationControls";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { Container, Draggable } from "react-smooth-dnd";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";

function SimulationsTab({ sourceFiles }) {
  const [current, setCurrent] = useState("simulationNode2");
  const [simNodes, setSimNodes] = useState([
    "simulationNode1",
    "simulationNode2",
    "simulationNode3",
  ]);

  const onDrop = ({ removedIndex, addedIndex }) => {
    setSimNodes((simNodes) => arrayMove(simNodes, removedIndex, addedIndex));
  };

  return (
    <>
      <Box>
        <SimulationsControls />
        <div
          className="repoContainer"
          style={{
            position: "relative",
            maxHeight: "50vh",
            "overflow-y": "auto",
          }}
        >
          <List>
            <Container
              dragHandleSelector=".drag-handle"
              lockAxis="y"
              onDrop={onDrop}
            >
              {simNodes.map((nodeId) => (
                <Draggable key={nodeId}>
                  <ListItem>
                    <ListItemText primary={nodeId} />
                    <ListItemSecondaryAction>
                      <ListItemIcon className="drag-handle">
                        <DragHandleRoundedIcon />
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Draggable>
              ))}
            </Container>
          </List>
          {/* {simFiles} */}
        </div>
      </Box>
    </>
  );
}

export default SimulationsTab;
