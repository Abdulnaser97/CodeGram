import React, { useState, useCallback, useRef, useEffect } from "react";

import ReactFlow, { addEdge, useZoomPanHelper } from "react-flow-renderer";
import { useSelector } from "react-redux";
import { addNodeToArray, deleteNodeFromArray } from "../Redux/actions/nodes";

var initialElements = [
  {
    id: "1",
    type: "input",
    data: { label: "Project Root", url: "" },
    position: { x: 500, y: 300 },
    animated: true,
    style: {
      borderColor: "#FFAEA6",
      color: "#6E6E6E",
      height: "2vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
];

const getNodeId = () => `randomnode_${+new Date()}`;

/**
 *
 * Component Starts Here
 *
 **/
export function useReactFlowWrapper({ dispatch }) {
  const { RFState } = useSelector((state) => {
    return { RFState: state.RFState };
  });
  const [elements, setElements] = useState(initialElements);
  const [nodeName, setNodeName] = useState("nodeName");

  // Selected node
  const [selectedEL, setSelectedEL] = useState(initialElements[0]);
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);

  const onElementClick = (event, element) => {
    console.log("click", element);
    setSelectedEL(element);
  };

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  // Delete Node
  const onElementsRemove = (elementsToRemove) => {
    if (elementsToRemove.length === 0) {
      console.log("nothing selected");
      return;
    }
    dispatch(deleteNodeFromArray(elementsToRemove[0]));
  };

  // add node function
  const addNode = useCallback(
    (file) => {
      var label = nodeName;
      const newNode = {
        id: getNodeId(),
        // this data will get filled with the array of JSON objects that will come
        // from Github
        data: {
          label: file.fileName !== undefined ? file.fileName : label,
          name: file.fileName !== undefined ? file.fileName : label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          url: file.url !== undefined ? file.url : "",
        },
        style: {
          backgroundColor: "#FFAEA6",
          color: "white",
          fontWeight: "bold",
          height: "2vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
        },
        position: { x: 500, y: 400 },
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      setElements((els) => els.concat(newNode));
    },
    [setElements, nodeName, dispatch]
  );

  // Refresh Diagram when nodesArr in store changes
  // useEffect(() => {
  //   if (repo && RFState) {
  //     setElements((els) => (els = RFState));
  //   }
  // }, [RFState, repo]);

  return {
    render: (
      <div className="canvas">
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={setRfInstance}
          onElementClick={onElementClick}
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