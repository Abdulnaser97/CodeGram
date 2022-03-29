import axios from "axios";
import { getFileSHA } from "../../api/apiClient";
import {
  LOAD_DIAGRAM_TO_STORE,
  LOAD_REPO_FROM_PUBLIC_URL,
  LOAD_TEMPLATE_DIAGRAM,
  RELOAD_DIAGRAM,
  SET_SOURCE_DOC_TAB,
  SET_IS_LOADING_DIAGRAM,
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
    const fileSHA = await getFileSHA(diagramFile.url);
    // Replace the branchName with the SHA to retrieve latest diagram data (to avoid github caching when not supplying a SHA)
    // Old url format: https://raw.githubusercontent.com/user/repo/branchName/Diagram1.CodeGram
    // New url format: https://raw.githubusercontent.com/user/repo/SHA/Diagram1.CodeGram
    var splitUrl = diagramFile.url.split("/");
    var path = splitUrl.pop();
    var branch = splitUrl.pop();
    var repo = splitUrl.pop();
    var username = splitUrl.pop();
    const fileURLWithSHA = `${splitUrl.join("/")}/${username}/${repo}/${
      fileSHA.sha
    }/${path}`;

    // Calls node url to get file content
    await axios
      .get(fileURLWithSHA)
      .then(function (response) {
        // Populate nodesZIndex array
        const nodesZIndex = populateZIndexArr(response.data.nodes);

        dispatch(
          loadDiagramToStore({
            elements: response.data,
            nodesZIndex: nodesZIndex,
          })
        );
        dispatch(setSourceDocTab(0));
        // dispatch notification diagram Found
        dispatch(successNotification(`Diagram Found!`));
      })

      .catch(function (error) {
        // Handle error
        console.log("loadDiagram: unable to load diagram. Error: ", error);
      });
  } else {
    dispatch(loadTemplateDiagram(true));
    dispatch(setSourceDocTab(0));
  }
  dispatch(setIsLoadingDiagram(false));
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

export function setIsLoadingDiagram(payload) {
  return {
    type: SET_IS_LOADING_DIAGRAM,
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
