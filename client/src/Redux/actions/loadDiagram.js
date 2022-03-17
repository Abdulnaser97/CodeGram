import axios from "axios";
import {
  LOAD_DIAGRAM_TO_STORE,
  LOAD_REPO_FROM_PUBLIC_URL,
  LOAD_TEMPLATE_DIAGRAM,
  RELOAD_DIAGRAM,
  SET_SOURCE_DOC_TAB,
} from "../constants";
import { successNotification } from "./notification";

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
        // dispatch notification diagram Found
        dispatch(successNotification(`Diagram Found!`));
        // Populate nodesZIndex array
        const nodesZIndex = populateZIndexArr(response.data.nodes);

        dispatch(
          loadDiagramToStore({ nodes: response.data, nodesZIndex: nodesZIndex })
        );
        dispatch(setSourceDocTab(0));
      })

      .catch(function (error) {
        // Handle error
        console.log("loadDiagram: unable to load diagram. Error: ", error);
      });
  } else {
    dispatch(loadTemplateDiagram(true));
    dispatch(setSourceDocTab(0));
  }
};

export function loadDiagramToStore(payload) {
  return {
    type: LOAD_DIAGRAM_TO_STORE,
    payload: payload,
  };
}

export function loadTemplateDiagram(payload) {
  return {
    type: LOAD_TEMPLATE_DIAGRAM,
    payload: payload,
  };
}

export function reloadDiagram(payload) {
  return {
    type: RELOAD_DIAGRAM,
    payload: payload,
  };
}

export function setSourceDocTab(payload) {
  return {
    type: SET_SOURCE_DOC_TAB,
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

export function loadRepoFromPublicURL(payload) {
  return {
    type: LOAD_REPO_FROM_PUBLIC_URL,
    payload: payload,
  };
}
