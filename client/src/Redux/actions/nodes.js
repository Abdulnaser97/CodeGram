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
    console.log("deleteNodes Action nodes", nodes);
    console.log("deleteNodes Action repoFiles", repoFiles);
    console.log("deleteNodes Action elementsToRemove", elementsToRemove);

    const idsToRemove = elementsToRemove.map(node => { return node.id; });
    console.log("IDS", idsToRemove);
    const newNodesArr = nodes.nodesArr.filter(node => { 
      return !(idsToRemove.includes(node.id));
    });
    console.log("newNodesArr", newNodesArr);
    // state.nodesArr.filter((node) => !(action.nodes.includes(node)))

    dispatch({
      type: DELETE_NODES_FROM_ARRAY,
      nodesArr: newNodesArr,
    });
  };
}
