import {
  ADD_NODE_TO_SIMULATION,
  ADD_SIMULATION,
  REMOVE_NODE_FROM_SIMULATION,
  SET_CURRENT_SIMULATION,
} from "../constants";

export function addNodeToSimulation(node) {
  return {
    type: ADD_NODE_TO_SIMULATION,
    payload: node.id,
  };
}

export function removeNodeFromSimulation(node) {
  return {
    type: REMOVE_NODE_FROM_SIMULATION,
    payload: node.id,
  };
}

export function addSimulation(simulation) {
  return {
    type: ADD_SIMULATION,
    payload: simulation,
  };
}

export function setCurrentSimulation(simulation) {
  return {
    type: SET_CURRENT_SIMULATION,
    payload: simulation,
  };
}
