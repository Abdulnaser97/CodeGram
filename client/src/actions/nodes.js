import {  ADD_NODE_TO_ARRAY, DELETE_NODES_FROM_ARRAY, SAVE_NODES_TO_FILE } from '../constants';

export function addNodeToArray(node) {
    return {
        type: ADD_NODE_TO_ARRAY,
        payload: node
    }
}

export function deleteNodeFromArray(node) {
    return {
        type: DELETE_NODES_FROM_ARRAY,
        nodeId: node.id
    }
}