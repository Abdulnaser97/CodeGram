import axios from "axios";
import { LOAD_DIAGRAM_TO_STORE, SYNC_RF_STATE } from "../constants";
import { setDoUpdateRFInternalInstance } from "./nodes";

export const loadDiagram = (repoFiles) => async (dispatch) => {
  var diagramFile = null;
  for (const [key, value] of Object.entries(repoFiles)) {
    if (key.includes(".CodeGram")) {
      diagramFile = value;
      break;
    }
  }

  if (diagramFile && diagramFile.url !== undefined) {
    // Calls node url to get file content
    axios
      .get(diagramFile.url)
      .then(function (response) {
        // Populate nodesZIndex array
        const nodesZIndex = populateZIndexArr(response.data.elements);
        dispatch(setDoUpdateRFInternalInstance(true));
        dispatch(
          loadDiagramToStore({ nodes: response.data, nodesZIndex: nodesZIndex })
        );
      })
      .catch(function (error) {
        // Handle error
        console.log("loadDiagram: unable to load diagram. Error: ", error);
      });
  }
};

export function loadDiagramToStore(payload) {
  return {
    type: LOAD_DIAGRAM_TO_STORE,
    payload: payload,
  };
}

export function syncRFState(payload) {
  return {
    type: SYNC_RF_STATE,
    payload: payload,
  };
}

function populateZIndexArr(nodes) {
  // Create an array of tuples [nodeId, nodeZIndex]
  let nodesZIndex = nodes.map((node) => {
    const zIndex = node.style ? parseInt(node.style.zIndex) : 3;
    return [node.id, zIndex];
  });

  // Sort based on nodesZIndex
  nodesZIndex.sort((a, b) => {
    return a[1] - b[1];
  });

  // Return the array of ids in order
  return nodesZIndex.map(([id, zIndex]) => id);
}
