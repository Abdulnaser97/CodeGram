import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  REDO,
  UNDO,
  UPDATE_NODE_DIMENSIONS,
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

    const newNodesArr = nodes.nodesArr.filter((node) => {
      return !idsToRemove.includes(node.id);
    });

    const newNodesZIndex = nodes.nodesZIndex.filter((node) => {
      return !idsToRemove.includes(node.id);
    });

    filesToUnlink.forEach((file) => {
      if (repoFiles.repoFiles[file]) {
        repoFiles.repoFiles[file].linked = false;
      }
    });

    dispatch({
      type: DELETE_NODES_FROM_ARRAY,
      nodesArr: newNodesArr,
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

export function undo() {
  return (dispatch, getState) => {
    const { RFState } = getState();

    dispatch({
      type: UNDO,
      payload: !RFState.undo,
    });
  };
}

export function redo() {
  return (dispatch, getState) => {
    const { RFState } = getState();

    dispatch({
      type: REDO,
      payload: !RFState.redo,
    });
  };
}

export function updateNodeDimensions(id, height, width) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_NODE_DIMENSIONS,
      payload: { id: id, height: height, width: width },
    });
  };
}
