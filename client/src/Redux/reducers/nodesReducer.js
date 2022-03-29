import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
  FETCH_REPO_FILES,
  UPDATE_NODE_Z_INDEX,
  LOAD_TEMPLATE_DIAGRAM,
  RELOAD_DIAGRAM,
  SET_IS_LOADING_DIAGRAM,
} from "../constants";

const initialState = {
  nodesArr: [],
  isLoadingDiagram: false,
  nodesZIndex: [],
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
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        nodesArr: action.payload.elements.nodes,
        nodesZIndex: action.payload.nodesZIndex,
      };
    case FETCH_REPO_FILES:
      state.isFetchingFiles = true;
      return {
        ...state,
        nodesArr: [],
      };
    case SET_IS_LOADING_DIAGRAM:
      return {
        ...state,
        isLoadingDiagram: action.payload,
      };
    default:
      return state;
  }
};

const RFinitialState = {
  RFState: {},
  loadTemplateDiagram: false,
  reloadDiagram: false,
};

export const RFStateReducer = (state = RFinitialState, action) => {
  switch (action.type) {
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        RFState: action.payload.elements,
      };
    case LOAD_TEMPLATE_DIAGRAM:
      return {
        ...state,
        loadTemplateDiagram: action.payload,
      };
    case RELOAD_DIAGRAM:
      return {
        ...state,
        reloadDiagram: action.payload,
      };

    default:
      return state;
  }
};
