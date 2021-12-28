import React, { useState, useCallback, useRef } from "react";

import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  useStoreState,
} from "react-flow-renderer";
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

export function useReactFlowWrapper({ dispatch }) {
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
    if (elementsToRemove.length == 0) {
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
          <ReactFlowStoreInterface />
        </ReactFlow>
      </div>
    ),
    addNode: addNode,
    setElements: setElements,
    setNodeName: setNodeName,
    onElementsRemove: onElementsRemove,
    initialElements: initialElements,
    selectedEL: selectedEL,
  };
}

export function ReactFlowStoreInterface() {
  const reactFlowState = useStoreState((state) => state);
  console.log(reactFlowState);

  return null;
}

// const flowKey = 'example-flow';

// const getNodeId = () => `randomnode_${+new Date()}`;

// const SaveRestore = () => {
//   const [rfInstance, setRfInstance] = useState(null);
//   const [elements, setElements] = useState(null);

//   const onSave = useCallback(() => {
//     if (rfInstance) {
//       const flow = rfInstance.toObject();
//       localforage.setItem(flowKey, flow);
//     }
//   }, [rfInstance]);

//   const onRestore = useCallback(() => {
//     const restoreFlow = async () => {
//       const flow = await localforage.getItem(flowKey);

//       if (flow) {
//         const [x = 0, y = 0] = flow.position;
//         setElements(flow.elements || []);
//         transform({ x, y, zoom: flow.zoom || 0 });
//       }
//     };

//     restoreFlow();
//   }, [setElements, transform]);

//   const onAdd = useCallback(() => {
//     const newNode = {
//       id: getNodeId(),
//       data: { label: 'Added node' },
//       position: {
//         x: Math.random() * window.innerWidth - 100,
//         y: Math.random() * window.innerHeight,
//       },
//     };
//     setElements((els) => els.concat(newNode));
//   }, [setElements]);

//   return (
//     <ReactFlowProvider>
//       <ReactFlow
//         elements={elements}
//         onElementsRemove={onElementsRemove}
//         onConnect={onConnect}
//         onLoad={setRfInstance}
//       >
//         <div className="save__controls">
//           <button onClick={onSave}>save</button>
//           <button onClick={onRestore}>restore</button>
//           <button onClick={onAdd}>add node</button>
//         </div>
//       </ReactFlow>
//     </ReactFlowProvider>
//   );
// };

// export default SaveRestore;
