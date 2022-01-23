import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  SAVE_NODES_TO_FILE,
} from "../constants";

export function addNodeToArray(node) {
  return {
    type: ADD_NODE_TO_ARRAY,
    payload: node,
  };
}

export function deleteNodeFromArray(elementsToRemove) {
  return (dispatch, getState) => {
    const {nodes, repoFiles} = getState();

    const idsToRemove = elementsToRemove.map(node => { return node.id; });
    const filesToUnlink = elementsToRemove.map(node => { return node.data.path; });

    const newNodesArr = nodes.nodesArr.filter(node => { 
      return !(idsToRemove.includes(node.id));
    });

    filesToUnlink.forEach(file => {
      if (repoFiles.repoFiles[file]) {
        repoFiles.repoFiles[file].linked = false;
      }
    })

    dispatch({
      type: DELETE_NODES_FROM_ARRAY,
      nodesArr: newNodesArr,
      repoFiles: repoFiles.repoFiles,
    });
  };
}
