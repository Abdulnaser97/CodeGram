import {  ADD_NODE_TO_ARRAY, SAVE_NODES_TO_FILE } from '../constants';

export function addNodeToArray(node) {
    return {
        type: ADD_NODE_TO_ARRAY,
        payload: node
    }
}