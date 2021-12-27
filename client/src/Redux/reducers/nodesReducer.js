import {
  ADD_NODE_TO_ARRAY,
  SAVE_NODES_TO_FILE,
  DELETE_NODES_FROM_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
} from "../constants";

const initialState = {
  nodesArr: [],
};

const nodesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NODE_TO_ARRAY:
      return {
        ...state,
        nodesArr: [...state.nodesArr, action.payload],
      };
    case DELETE_NODES_FROM_ARRAY:
      return {
        ...state,
        nodesArr: state.nodesArr.filter((node) => action.nodeId !== node.id),
      };
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        nodesArr: action.payload,
      };
    default:
      return state;
  }
};

export default nodesReducer;
