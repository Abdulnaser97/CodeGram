import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
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
import { addNodeToArray, deleteNodeFromArray } from "../Redux/actions/nodes";


import FloatingEdge from "../canvas/FloatingEdge.tsx";
import FloatingConnectionLine from "../canvas/FloatingConnectionLine.tsx";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// const edgeTypes = {
//   floating: FloatingEdge,
// };

var initialElements = [
  {
    id: "1",
    type: "input",
    data: { label: "Project Root", url: "", width: 200, height: 150 },
    position: { x: 500, y: 300 },
    animated: true,
    style: {
      borderColor: "#FFAEA6",
      color: "#6E6E6E",
      height: "200px",
      width: "150px",
      display: "flex",
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
    floating:FloatingEdge
};

const getNodeId = () => `randomnode_${+new Date()}`;

/**
 *
 * Component Starts Here
 *
 **/
export function useReactFlowWrapper({ dispatch, selectedShapeName, activeShape }) {
  const { RFState } = useSelector((state) => {
    return { RFState: state.RFState };
  });

  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState("");

  // Selected node
  const [selectedEL, setSelectedEL] = useState(initialElements[0]); ///////////////////////////////////////////////
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [floatTargetHandle, setFloatTargetHandle] = useState(false); // This is a hacky method to force rendering
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    setSelectedEL(node);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );
  };

  const handleContextMenuClose = (event) => {
    setContextMenu(null);
  };
  // get stat
  const [useShape, setUseShape] = useState(selectedShapeName)
  const onElementClick = (event, element) => {
    //console.log("click", element);
    setSelectedEL(element);
  };

  const onPaneClick = (event) => {
    console.log(event)
    if (activeShape === "selectShape"){
      addNodeFromClick(event)
    }
  }

  const onConnect = (params) => {
    setElements((els) =>
      addEdge(
        // TODO : lookinto styling floating edges  and smoothstep 
        { ...params, type: "floating smoothstep", arrowHeadType: ArrowHeadType.Arrow },
        els
      )
    );
  };

  const onConnectStart = (event, { nodeId, handleType }) => {
    setConnectionStarted(true);
  };
  const onConnectStop = (event) => {
    setConnectionStarted(false);
  };
  const onConnectEnd = (event) => {
    setConnectionStarted(false);
  };

  const onNodeMouseEnter = (event, node) => {
    if (connectionStarted) {
      node.data.floatTargetHandle = true;
      setFloatTargetHandle(true);
    }
  };

  const onNodeMouseMove = (event, node) => {};

  const onNodeMouseLeave = (event, node) => {
    node.data.floatTargetHandle = false;
    setFloatTargetHandle(false);
  };

  const onNodeContextMenuDelete = (event) => {
    event.preventDefault();
    onElementsRemove([selectedEL]);
    handleContextMenuClose();
  };

  // Delete Node
  const onElementsRemove = (elementsToRemove) => {
    if (elementsToRemove.length === 0) {
      console.log("nothing selected");
      return;
    }
    dispatch(deleteNodeFromArray(elementsToRemove));
    setElements((els) => removeElements(elementsToRemove, els));
  };

  // Add node function
  const addNode = useCallback(
    (file) => {
      var label = nodeName;
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
          url: file && file.download_url !== undefined ? file.download_url : file.url,
          path: file && file.path,
          floatTargetHandle: false,
        
          // can set this type to whatever is selected in the tool bar for now
          // but the type will probably be set from a few different places
          type:'fileNode',
          width: 200,
          height: 200,
          // type: file.nodeType !== undefined ? file.nodeType: "wrapperNode",
          //file: file
        },
        type: 'fileNode',
        width: 200,
        height: 200,
        position: { x: 500, y: 400 },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch]
  );

  const addNodeFromClick = useCallback(
    (event) => {
      var label = nodeName;
      const newNode = {
        id: getNodeId(),
        data: {
          label: label,
          name: label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          floatTargetHandle: false,
        
          // can set this type to whatever is selected in the tool bar for now
          // but the type will probably be set from a few different places
          type: typeSelection(),
          width: 200,
          height: 200,
          // type: file.nodeType !== undefined ? file.nodeType: "wrapperNode",
        },
        type: 'fileNode',
        width: 200,
        height: 200,
        position: { x: event.clientX, y: event.clientY },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch]
  );

  const typeSelection = () => {
    console.log(selectedShapeName)
    if (selectedShapeName.current === "DashedShape"){
      return 'square-container'
    } else if (selectedShapeName.current === "rect"){
      return 'fileNode'
    } else if (selectedShapeName.current === "CircleShape"){
      return 'cylinder'
    }
  }


  return {
    render: (
      <div className="canvas">
        <ReactFlow
          nodeTypes={{
            default: CustomNodeComponent,
            fileNode: CustomNodeComponent,
            wrapperNode: WrapperNodeComponent,
            cylinder: CustomNodeComponent,
            circle: CustomNodeComponent,
          }}
          elements={elements}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={setRfInstance}
          onElementClick={onElementClick}
          key="edges"
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
          <MenuItem onClick={onNodeContextMenuDelete}>Delete</MenuItem>
          <MenuItem onClick={handleContextMenuClose}>Bring Forward</MenuItem>
          <MenuItem onClick={handleContextMenuClose}>Bring Backward</MenuItem>
        </Menu>
      </div>
    ),
    elements:elements, 
    addNode: addNode,
    setElements: setElements,
    setNodeName: setNodeName,
    onElementsRemove: onElementsRemove,
    initialElements: initialElements,
    selectedEL: selectedEL,
    rfInstance: rfInstance,
    setSelectedEL: setSelectedEL
  };
}

export function ReactFlowStoreInterface({ RFState, setElements }) {
  // Uncomment below to view reactFlowState
  // const reactFlowState = useStoreState((state) => state);
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
