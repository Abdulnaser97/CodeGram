import React, { useState, useCallback } from "react";

import ReactFlow, {
  ReactFlowProvider,
  useStoreState,
} from "react-flow-renderer";

// Uncomment blow to access the redux store of React Flow library
//https://github.com/wbkd/react-flow/tree/main/src/store
export function ReactFlowWrapper(props) {
  return (
    <div className="canvas">
      <ReactFlow
        elements={props.elements}
        onElementsRemove={props.onElementsRemove}
        onConnect={props.onConnect}
        onLoad={props.setRfInstance}
        onElementClick={props.onElementClick}
      >
        <ReactFlowStoreInterface />
      </ReactFlow>
    </div>
  );
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
