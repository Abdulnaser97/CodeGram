import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
  FolderNodeComponent,
  HomeNodeComponent,
  LinkComponent,
  SignUpComponent,
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

import { updateRepoFile } from "../Redux/actions/repoFiles";

import FloatingEdge from "../canvas/FloatingEdge.tsx";
import FloatingConnectionLine from "../canvas/FloatingConnectionLine.tsx";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import template from "../Templates/FullStackTemplate.json";
import ControlTemplate from "../Templates/ControlTemplate.json";
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

initialElements = ControlTemplate.elements;

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
  search,
  setSearch,
  fuse,
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
  function calculatePosition(
    event = null,
    rfInstance = null,
    oldPosition = null
  ) {
    let position = null;
    if (event) {
      if (rfInstance) {
        position = rfInstance.project({ x: event.clientX, y: event.clientY });
      } else {
        position = { x: event.clientX, y: event.clientY };
      }
    } else if (oldPosition) {
      position = { x: oldPosition.x + 30, y: oldPosition.y + 30 };
    } else {
      position = { x: 500, y: 400 };
    }

    // Make coordinate a multiple of 15 so it snaps to grid
    position.x = Math.floor(position.x / 15) * 15;
    position.y = Math.floor(position.y / 15) * 15;
    return position;
  }
  // Add node function
  const addNode = useCallback(
    (props) => {
      var file = props.file ? props.file : null;
      var event = props.event ? props.event : null;
      var label = "";
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
            selectedShapeName.current && !file === "DashedShape"
              ? Math.floor(300 / 15) * 15
              : Math.floor(100 / 15) * 15,
          height:
            selectedShapeName.current && !file === "DashedShape"
              ? Math.floor(150 / 15) * 15
              : Math.floor(70 / 15) * 15,
          // type: file.nodeType !== undefined ? file.nodeType: "wrapperNode",
          //file: file
          nodeInputHandler: nodeInputHandler,
        },
        type: file ? "FileNode" : selectedShapeName.current,
        width:
          selectedShapeName.current && !file === "DashedShape"
            ? Math.floor(300 / 15) * 15
            : Math.floor(100 / 15) * 15,
        height:
          selectedShapeName.current && !file === "DashedShape"
            ? Math.floor(150 / 15) * 15
            : Math.floor(70 / 15) * 15,
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
    } else {
      setSelectedEL(null);
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

  const onCopy = (event = null) => {
    if (
      selectedEL &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "DIV"
    ) {
      if (event) {
        event.preventDefault();
      }

      let copyEl = JSON.parse(JSON.stringify(selectedEL));
      setClipBoard(copyEl);

      if (event) {
        handleContextMenuClose();
      }
    }
  };

  const onPaste = (event = null) => {
    if (event) {
      event.preventDefault();
    }
    if (clipBoard) {
      let newNode = clipBoard;
      newNode.id = getNodeId();
      newNode.position = calculatePosition(event, rfInstance, newNode.position);
      console.log("newNode is: ", newNode);
      setElements((els) => els.concat(newNode));
      dispatch(addNodeToArray(newNode));
    }
    if (event) {
      handleContextMenuClose();
    }
  };

  console.log(elements);

  const keydownHandler = (e) => {
    // Ctrl + C (Cmd + C) for copy
    if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
      onCopy();
    }

    // Ctrl + V (Cmd + V) for paste
    if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
      if (clipBoard) {
        onPaste();
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

  const addFileToNode = (file) => {
    console.log(selectedEL);
    var selEl = null;
    setElements((els) =>
      els.map((el) => {
        if (el.id === selectedEL.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el.data = {
            ...el.data,
            label: file.name,
            url:
              file && file.download_url !== undefined
                ? file.download_url
                : file && file.url !== undefined
                ? file.url
                : null,
            path: file && file.path ? file.path : "",
            floatTargetHandle: false,

            // can set this type to whatever is selected in the tool bar for now
            // but the type will probably be set from a few different places
            type: file ? "FileNode" : selectedShapeName.current,
          };
          selEl = el;
        }

        return el;
      })
    );
    setSelectedEL(selEl);
    dispatch(updateRepoFile(selEl));
  };

  const [nameFlag, setNameFlag] = useState(false);

  const setter = (value) => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === selectedEL.id) {
          el.data = {
            ...el.data,
            label: value,
          };
          setSelectedEL(el);
          setSearch("");
        }
        return el;
      })
    );
  };

  useEffect(() => {
    // console.log(selectedEL)
    if (nameFlag) {
      setter(search);
      setNameFlag(false);
    }
  }, [nameFlag]);

  function nodeInputHandler(event) {
    if (event.key === "Enter") {
      setSearch(event.target.value);
      setNameFlag(true);
    } else {
      setSearch(event.target.value);
    }
  }

  // for pop up later
  // console.log(selectedEL)
  // useEffect(() => {
  //   if (fuse && search) {
  //     var results = fuse.search(search);
  //     var newResults = results.map((result) => result.item);
  //     setFileResults(newResults);
  //   }
  // }, [search])

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
            home: HomeNodeComponent,
            LinkComponent: LinkComponent,
            SignUpComponent: SignUpComponent,
          }}
          elements={elements}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={setRfInstance}
          onElementClick={onElementClick}
          snapToGrid
          snapGrid={[15, 15]}
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
          // search={search}
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
          {/* {search !== null && contextMenu === null  && (
            <MenuItem
              style={{ position: "relative", width: "15vw", backgroundClolor:'red' }}
            >
               <div className="menu-item">
                <h1>HELLO!</h1>
              {
                fileResults && fileResults.map((file) => {
                  <div className="menu-text">
                    {file.name}
                  </div> 
                })
              }          
               </div>
            </MenuItem> */}
          {/* )} */}
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
    addFileToNode: addFileToNode,
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
