import {
  ADD_NODE_TO_ARRAY,
  DELETE_NODES_FROM_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
  FETCH_REPO_FILES,
  UPDATE_NODE_Z_INDEX,
  SET_UPDATE_RF_INSTANCE_FLAG,
  SYNC_RF_STATE,
  SET_UNDO_REDO_FLAG,
} from "../constants";

const initialState = {
  nodesArr: [],
  isLoadingDiagram: true,
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
  RFState: {
    elements: [
      {
        id: "1",
        type: "input",
        data: { label: "Project Root", url: "", width: 1, height: 1 },
        position: { x: 0, y: 0 },
        animated: true,
        style: {
          borderColor: "transparent",
          color: "transparent",
          background: "transparent",
          height: "0px",
          width: "0px",
          display: "none",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    ],
    position: [0, 0],
    zoom: 1,
  },
  isUndoRedo: false,
  updateRFInternalInstance: false,
};

export const RFStateReducer = (state = RFinitialState, action) => {
  switch (action.type) {
    case LOAD_DIAGRAM_TO_STORE:
      return {
        ...state,
        RFState: action.payload.nodes,
      };
    case SET_UPDATE_RF_INSTANCE_FLAG:
      return {
        ...state,
        updateRFInternalInstance: action.payload,
      };
    case SYNC_RF_STATE:
      return {
        ...state,
        RFState: action.payload,
      };
    case SET_UNDO_REDO_FLAG:
      return {
        ...state,
        isUndoRedo: action.payload,
      };
    default:
      return state;
  }
};
