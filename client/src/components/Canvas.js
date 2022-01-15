import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
} from "../canvas/custom_node";
import ReactFlow, {
  addEdge,
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
 **/
export function useReactFlowWrapper({
  dispatch,
  selectedShapeName,
  activeToolBarButton,
  setActiveToolBarButton,
}) {
  const { RFState } = useSelector((state) => {
    return { RFState: state.RFState };
  });

  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState("");

  // Selected node
  const [selectedEL, setSelectedEL] = useState(initialElements[0]);
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [floatTargetHandle, setFloatTargetHandle] = useState(false); // This is a hacky method to force rendering

  // Add node function
  const addNode = useCallback(
    (props) => {
      var file = props.file ? props.file : null;
      var event = props.event ? props.event : null;
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
          x: event ? event.clientX : 500,
          y: event ? event.clientY : 400,
        },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch]
  );

  // get stat
  const onElementClick = (event, element) => {
    //console.log("click", element);
    setSelectedEL(element);
  };

  const onPaneClick = async (event) => {
    console.log(event);
    if (activeToolBarButton === "selectShape") {
      await addNode({ event: event });
      setActiveToolBarButton("cursor");
    }
  };

  const onConnect = (params) => {
    setElements((els) =>
      addEdge(
        // TODO : lookinto styling floating edges  and smoothstep
        { ...params, type: "floating", arrowHeadType: ArrowHeadType.Arrow },
        els
      )
    );
  };

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

  // Delete Node
  const onElementsRemove = (elementsToRemove) => {
    if (elementsToRemove.length === 0) {
      console.log("nothing selected");
      return;
    }
    dispatch(deleteNodeFromArray(elementsToRemove[0]));
  };

  return {
    render: (
      <div className="canvas">
        <ReactFlow
          nodeTypes={{
            default: CustomNodeComponent,
            FileNode: CustomNodeComponent,
            DashedShape: WrapperNodeComponent,
            CircleShape: CustomNodeComponent,
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
        >
          <ReactFlowStoreInterface {...{ RFState, setElements }} />
        </ReactFlow>
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
