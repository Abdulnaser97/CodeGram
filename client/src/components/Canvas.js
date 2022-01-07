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
import {useToolBar} from "../components/ToolBar.js";

import FloatingEdge from "../canvas/FloatingEdge.tsx";
import FloatingConnectionLine from "../canvas/FloatingConnectionLine.tsx";

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
export function useReactFlowWrapper({ dispatch, selectedShapeName }) {
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

  // get stat
  const [useShape, setUseShape] = useState(selectedShapeName)

  const onElementClick = (event, element) => {
    //console.log("click", element);
    setSelectedEL(element);
  };

  const onConnect = (params) => {
    console.log(params);
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

  // Delete Node
  const onElementsRemove = (elementsToRemove) => {
    if (elementsToRemove.length === 0) {
      console.log("nothing selected");
      return;
    }
    dispatch(deleteNodeFromArray(elementsToRemove[0]));
  };

  // Add node function
  const addNode = useCallback(
    (file) => {
      var label = nodeName;
      //const [selectedNodeType, selectedNodeTypeName] = SendNodeType();
      const newNode = {
        id: getNodeId(),
        // this data will get filled with the array of JSON objects that will come
        // from Github
        data: {
          label: file.name !== undefined ? file.name : label,
          name: file.name !== undefined ? file.name : label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          url: file.download_url !== undefined ? file.download_url : file.url,
          path: file.path,
          floatTargetHandle: false,
        
          // can set this type to whatever is selected in the tool bar for now
          // but the type will probably be set from a few different places
          type: file.name !== undefined ? 'fileNode' : 'square-container',
          width: 200,
          height: 200,
          // type: file.nodeType !== undefined ? file.nodeType: "wrapperNode",
          file: file
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
        >
          <ReactFlowStoreInterface {...{ RFState, setElements }} />
        </ReactFlow>
      </div>
    ),
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
