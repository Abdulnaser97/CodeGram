import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  UPDATE_NODE_Z_INDEX,
} from "../constants";

export function addNodeToArray(node) {
  return {
    type: ADD_NODE_TO_ARRAY,
    payload: node,
  };
}

export function deleteNodeFromArray(elementsToRemove) {
  return (dispatch, getState) => {
    const { nodes, repoFiles } = getState();

    const idsToRemove = elementsToRemove.map((node) => {
      return node.id;
    });
    const filesToUnlink = elementsToRemove.map((node) => {
      return node.data.path;
    });

    // const newNodesArr = nodes.nodesArr.filter((node) => {
    //   return !idsToRemove.includes(node.id);
    // });

    const newNodesZIndex = nodes.nodesZIndex.filter((node) => {
      return !idsToRemove.includes(node.id);
    });

    filesToUnlink.forEach((file) => {
      if (repoFiles.repoFiles[file]) {
        repoFiles.repoFiles[file].linked = false;
      }
    });
    // console.log(filesToUnlink);

    dispatch({
      type: DELETE_NODES_FROM_ARRAY,
      // nodesArr: newNodesArr,
      repoFiles: repoFiles.repoFiles,
      nodesZIndex: newNodesZIndex,
    });
  };
}

export function sendToBack(element) {
  return (dispatch, getState) => {
    const { nodes } = getState();

    var newNodesZIndex = nodes.nodesZIndex;

    // Remove from array
    var idx = newNodesZIndex.indexOf(element.id);
    if (idx !== -1) {
      newNodesZIndex.splice(idx, 1);
    }

    // Add to batch (beginning of array)
    newNodesZIndex.unshift(element.id);

    dispatch({
      type: UPDATE_NODE_Z_INDEX,
      nodesZIndex: newNodesZIndex,
    });
  };
}

export function bringToFront(element) {
  return (dispatch, getState) => {
    const { nodes } = getState();

    var newNodesZIndex = nodes.nodesZIndex;

    // Remove from array
    var idx = newNodesZIndex.indexOf(element.id);
    if (idx !== -1) {
      newNodesZIndex.splice(idx, 1);
    }

    // Add to batch (beginning of array)
    newNodesZIndex.push(element.id);

    dispatch({
      type: UPDATE_NODE_Z_INDEX,
      nodesZIndex: newNodesZIndex,
    });
  };
}
