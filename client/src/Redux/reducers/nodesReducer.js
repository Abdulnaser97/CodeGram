import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
  FETCH_REPO_FILES,
  UPDATE_NODE_Z_INDEX,
  UNDO,
  REDO,
  UPDATE_NODE_DIMENSIONS,
} from "../constants";

const initialState = {
  nodesArr: [],
  isLoadingDiagram: true,
  nodesZIndex: [],
  curNodeDimensions: {},
};

export const nodesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NODE_TO_ARRAY:
      return {
        ...state,
        nodesArr: [...state.nodesArr, action.payload],
        nodesZIndex: [...state.nodesZIndex, action.payload.id],
      };
    case DELETE_NODES_FROM_ARRAY:
      return {
        ...state,
        // nodesArr: state.nodesArr.filter((node) => !(action.nodes.includes(node))),
        nodesArr: action.nodesArr,
        nodesZIndex: action.nodesZIndex,
      };
    case UPDATE_NODE_Z_INDEX:
      return {
        ...state,
        nodesZIndex: action.nodesZIndex,
      };
    case UPDATE_NODE_DIMENSIONS:
      return {
        ...state,
        curNodeDimensions: action.payload,
      };

    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        nodesArr: action.payload.nodes.elements,
        nodesZIndex: action.payload.nodesZIndex,
        isLoadingDiagram: false,
      };
    case FETCH_REPO_FILES:
      state.isFetchingFiles = true;
      return {
        ...state,
        isLoadingDiagram: true,
        nodesArr: [],
      };
    default:
      return state;
  }
};

const RFinitialState = {
  RFState: {},
  undo: false,
  redo: false,
};

export const RFStateReducer = (state = RFinitialState, action) => {
  switch (action.type) {
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        RFState: action.payload.nodes,
      };

    case UNDO:
      return {
        ...state,
        undo: action.payload,
      };
    case REDO:
      return {
        ...state,
        redo: action.payload,
      };
    default:
      return state;
  }
};
