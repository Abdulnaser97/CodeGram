import {
  ADD_NODE_TO_ARRAY,
  SAVE_NODES_TO_FILE,
  DELETE_NODES_FROM_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
  FETCH_REPO_FILES
} from "../constants";


const initialState = {
  nodesArr: [],
  isLoadingDiagram: true 
};

export const nodesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NODE_TO_ARRAY:
      return {
        ...state,
        nodesArr: [...state.nodesArr, action.payload],
      };
    case DELETE_NODES_FROM_ARRAY:
      return {
        ...state,
        nodesArr: state.nodesArr.filter((node) => !(action.nodes.includes(node))),
      };
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        nodesArr: action.payload.elements,
        isLoadingDiagram: false, 
      };
    case FETCH_REPO_FILES:
      state.isFetchingFiles = true;
      return {
        ...state,
        isLoadingDiagram: true,
        nodesArr:[]
      };
    default:
      return state;
  }
};

const RFinitialState = {
  RFState: {},
};

export const RFStateReducer = (state = RFinitialState, action) => {
  switch (action.type) {
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        RFState: action.payload,
      };
    default:
      return state;
  }
};
