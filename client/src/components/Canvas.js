import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
  FolderNodeComponent,
} from "../canvas/custom_node";
import ReactFlow, {
  addEdge,
  removeElements,
  useZoomPanHelper,
  ArrowHeadType,
  useStoreState,
  SmoothStepEdge,
  StraightEdge,
  StepEdge,
} from "react-flow-renderer";
import { useSelector } from "react-redux";
import {
  addNodeToArray,
  bringToFront,
  deleteNodeFromArray,
  sendToBack,
} from "../Redux/actions/nodes";

import FloatingEdge from "../canvas/FloatingEdge.tsx";
import FloatingConnectionLine from "../canvas/FloatingConnectionLine.tsx";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// const edgeTypes = {
//   floating: FloatingEdge,
// };

var initialElements = [
  {
    id: "1",
    type: "input",
    data: { label: "Project Root", url: "", width: 1, height: 1 },
    position: { x: 0, y: 0 },
    animated: true,
    style: {
      borderColor: "transparent",
      color: "transparent",
      background: "transparent",
      height: "0px",
      width: "0px",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
    },
  },
];

const edgeTypes = {
  default: SmoothStepEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  floating: FloatingEdge,
};

const getNodeId = () => `randomnode_${+new Date()}`;

/**
 *
 * Component Starts Here
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 **/
export function useReactFlowWrapper({
  dispatch,
  selectedShapeName,
  activeToolBarButton,
  setActiveToolBarButton,
  setOpenArtifact,
}) {
  const { RFState, nodesZIndex } = useSelector((state) => {
    return { RFState: state.RFState, nodesZIndex: state.nodes.nodesZIndex };
  });

  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState("");

  // Selected node
  const [selectedEL, setSelectedEL] = useState(initialElements[0]);
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [floatTargetHandle, setFloatTargetHandle] = useState(false); // This is a hacky method to force rendering
  const [contextMenu, setContextMenu] = useState(null);
  const [clipBoard, setClipBoard] = useState(null);
  const [selectedNodeEvent, setSelectedNodeEvent] = useState(null);
  const [requestUpdateZIndex, setRequestUpdateZIndex] = useState(false);

  // Projects event click position to RF coordinates
  function calculatePosition(event, rfInstance) {
    if (event) {
      if (rfInstance) {
        return rfInstance.project({ x: event.clientX, y: event.clientY });
      } else {
        return { x: event.clientX, y: event.clientY };
      }
    } else {
      return { x: 500, y: 400 };
    }
  }
  // Add node function
  const addNode = useCallback(
    (props) => {
      var file = props.file ? props.file : null;
      var event = props.event ? props.event : null;
      var label = nodeName;
      var position = calculatePosition(event, rfInstance);

      let url =
        file && file.download_url !== undefined
          ? file.download_url
          : file && file.url !== undefined
          ? file.url
          : null;

      const newNode = {
        id: getNodeId(),
        data: {
          label: file && file.name !== undefined ? file.name : label,
          name: file && file.name !== undefined ? file.name : label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          url: url,
          path: file && file.path ? file.path : "",
          floatTargetHandle: false,

          // can set this type to whatever is selected in the tool bar for now
          // but the type will probably be set from a few different places
          type: file ? "FileNode" : selectedShapeName.current,
          width:
            selectedShapeName.current && !file === "DashedShape" ? 300 : 100,
          height:
            selectedShapeName.current && !file === "DashedShape" ? 150 : 70,
          // type: file.nodeType !== undefined ? file.nodeType: "wrapperNode",
          //file: file
        },
        type: file ? "FileNode" : selectedShapeName.current,
        width: selectedShapeName.current && !file === "DashedShape" ? 300 : 100,
        height: selectedShapeName.current && !file === "DashedShape" ? 150 : 70,
        position: {
          x: position.x,
          y: position.y,
        },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch]
  );

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    setSelectedEL(node);
    setSelectedNodeEvent(event);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "elementMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setSelectedEL(edge);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "elementMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleContextMenuClose = (event) => {
    setContextMenu(null);
    setSelectedNodeEvent(null);
    console.log("rfInstance", rfInstance);
    console.log("rfInstance to Object", rfInstance.toObject());
  };

  const handlePaneContextMenu = (event) => {
    event.preventDefault();
    if (clipBoard) {
      clipBoard.position.x = event.clientX;
      clipBoard.position.y = event.clientY;
      setClipBoard(clipBoard);
    }
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "paneMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  // get stat
  const onElementClick = (event, element) => {
    console.log("click", element);
    setSelectedEL(element);
  };

  const onPaneClick = async (event) => {
    console.log(event);
    if (activeToolBarButton === "selectShape") {
      await addNode({ event: event });
      setActiveToolBarButton("cursor");
    }
  };

  // Delete Node
  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      if (elementsToRemove.length === 0) {
        console.log("nothing selected");
        return;
      }
      dispatch(deleteNodeFromArray(elementsToRemove));
      setOpenArtifact("");
      setElements((els) => removeElements(elementsToRemove, els));
    },
    [setElements, dispatch]
  );

  const onConnect = (params) => {
    setElements((els) =>
      addEdge(
        // TODO : lookinto styling floating edges  and smoothstep
        {
          ...params,
          type: "floating",
          arrowHeadType: ArrowHeadType.Arrow,
          data: {
            label: "",
            wiki: "",
          },
        },
        els
      )
    );
  };

  // Updates zIndex of all nodes, this has an O(n^n) complexity TODO: optimize
  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        nodesZIndex.forEach((nodeId, index) => {
          if (el.id === nodeId) {
            let newIndex = index + 7;
            newIndex = newIndex.toString();
            el.style = { ...el.style, zIndex: newIndex };
          }
        });
        return el;
      })
    );
    setRequestUpdateZIndex(false);
  }, [nodesZIndex, requestUpdateZIndex]);

  const onConnectStart = (event, { nodeId, handleType }) => {
    setConnectionStarted(true);
    console.log("connection started");
  };
  const onConnectStop = (event) => {
    setFloatTargetHandle(false);

    setConnectionStarted(false);
    console.log("connection stopped");
  };
  const onConnectEnd = (event) => {
    event.target.style.zIndex = -1;
    setFloatTargetHandle(false);
    setConnectionStarted(false);
    console.log("connection ended");
  };

  const onNodeMouseEnter = (event, node) => {
    if (connectionStarted && !floatTargetHandle) {
      node.data.floatTargetHandle = true;
      setFloatTargetHandle(true);
      console.log(
        "on Mouse Enter and connection started and NOT float target handle"
      );
    }
  };

  const onNodeMouseMove = (event, node) => {
    if (!connectionStarted && floatTargetHandle) {
      node.data.floatTargetHandle = false;
      setFloatTargetHandle(false);
      console.log("on Mouse Move");
    }
  };

  const onNodeMouseLeave = (event, node) => {
    node.data.floatTargetHandle = false;
    setFloatTargetHandle(false);
  };

  const onNodeContextMenuDelete = (event) => {
    event.preventDefault();
    onElementsRemove([selectedEL]);
    handleContextMenuClose();
  };

  const onNodeBringToFront = async (event) => {
    event.preventDefault();
    await dispatch(bringToFront(selectedEL));
    setRequestUpdateZIndex(true);

    handleContextMenuClose();
  };

  const onNodeSendToBack = async (event) => {
    event.preventDefault();
    await dispatch(sendToBack(selectedEL));
    setRequestUpdateZIndex(true);
    handleContextMenuClose();
  };

  const onCopy = (event) => {
    event.preventDefault();
    let copyEl = JSON.parse(JSON.stringify(selectedEL));
    copyEl.id = getNodeId();
    setClipBoard(copyEl);
    handleContextMenuClose();
  };

  const onPaste = (event) => {
    event.preventDefault();
    if (clipBoard) {
      setElements((els) => els.concat(clipBoard));
      dispatch(addNodeToArray(clipBoard));
    }
    handleContextMenuClose();
  };

  const keydownHandler = (e) => {
    // Ctrl + C (Cmd + C) for copy
    if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "DIV"
      ) {
        let copyEl = JSON.parse(JSON.stringify(selectedEL));
        copyEl.id = getNodeId();
        setClipBoard(copyEl);
      }
    }

    // Ctrl + V (Cmd + V) for paste
    if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
      if (clipBoard) {
        clipBoard.position.x += 70;
        clipBoard.position.y -= 70;
        setClipBoard(clipBoard);
        setElements((els) => els.concat(clipBoard));
        dispatch(addNodeToArray(clipBoard));
      }
    }

    // backspace for delete
    if (e.keyCode === 8) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "DIV"
      ) {
        onElementsRemove([selectedEL]);
      }
    }

    // [ key for send to back
    if (e.keyCode === 219) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "DIV"
      ) {
        dispatch(sendToBack(selectedEL));
        setRequestUpdateZIndex(true);
      }
    }

    // ] key for bring to front
    if (e.keyCode === 221) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "DIV"
      ) {
        dispatch(bringToFront(selectedEL));
        setRequestUpdateZIndex(true);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return {
    render: (
      <div className="canvas">
        <ReactFlow
          nodeTypes={{
            default: CustomNodeComponent,
            FileNode: CustomNodeComponent,
            DashedShape: WrapperNodeComponent,
            CircleShape: FolderNodeComponent,
            circle: CustomNodeComponent,
          }}
          elements={elements}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={setRfInstance}
          onElementClick={onElementClick}
          snapToGrid
          key="floating"
          onConnectStart={onConnectStart}
          onConnectStop={onConnectStop}
          onConnectEnd={onConnectEnd}
          connectionMode={"loose"}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onPaneClick={onPaneClick}
          selectNodesOnDrag={false}
          onNodeContextMenu={handleContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onPaneContextMenu={handlePaneContextMenu}
          minZoom={0.1}
          maxZoom={4}
        >
          <ReactFlowStoreInterface {...{ RFState, setElements }} />
        </ReactFlow>
        <Menu
          open={contextMenu !== null}
          onClose={handleContextMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeContextMenuDelete}>
              <div className="menu-item">
                <div className="menu-text">Delete</div>
                <div className="shortcut-key">backspace</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeBringToFront}>
              <div className="menu-item">
                <div className="menu-text">Bring To Front</div>
                <div className="shortcut-key">]</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeSendToBack}>
              <div className="menu-item">
                <div className="menu-text">Send To Back</div>
                <div className="shortcut-key">[</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem
              onClick={onCopy}
              style={{ position: "relative", width: "15vw" }}
            >
              <div className="menu-item">
                <div className="menu-text">Copy Shape</div>
                <div className="shortcut-key">cmd/ctrl+c</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "paneMenu" && (
            <MenuItem
              onClick={onPaste}
              style={{ position: "relative", width: "15vw" }}
            >
              <div className="menu-item">
                <div className="menu-text">Paste Shape</div>
                <div className="shortcut-key">cmd/ctrl+v</div>
              </div>
            </MenuItem>
          )}
        </Menu>
      </div>
    ),
    elements: elements,
    addNode: addNode,
    setElements: setElements,
    setNodeName: setNodeName,
    onElementsRemove: onElementsRemove,
    initialElements: initialElements,
    selectedEL: selectedEL,
    rfInstance: rfInstance,
    setSelectedEL: setSelectedEL,
  };
}

export function ReactFlowStoreInterface({ RFState, setElements }) {
  // Uncomment below to view reactFlowState
  //const reactFlowState = useStoreState((state) => state);

  const { transform } = useZoomPanHelper();

  useEffect(() => {
    if (RFState && RFState.RFState.position) {
      const [x = 0, y = 0] = RFState.RFState.position;
      setElements(RFState.RFState.elements || []);
      transform({ x, y, zoom: RFState.RFState.zoom || 0 });
    }
  }, [RFState, setElements, transform]);

  return null;
}
