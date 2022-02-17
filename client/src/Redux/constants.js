// Nodes
export const ADD_NODE_TO_ARRAY = "ADD_NODE_TO_ARRAY";
export const SAVE_NODES_TO_FILE = "SAVE_NODES_TO_FILE";
export const DELETE_NODES_FROM_ARRAY = "DELETE_NODES_FROM_ARRAY";

// Repo files

export const FETCH_REPO_FILES = "FETCH_REPO_FILES";
export const STORE_REPO_FILES = "STORE_REPO_FILES";
export const UPDATE_REPO_FILE = "UPDATE_REPO_FILE";

// Load existing diagram from github repo
export const LOAD_DIAGRAM_TO_STORE = "LOAD_DIAGRAM_TO_STORE";

// Display popup notification
export const ERROR_NOTIFICATION = "ERROR_NOTIFICATION";
export const SUCCESS_NOTIFICATION = "SUCCESS_NOTIFICATION";

// Updates the z-index of the selected node to control layering
export const UPDATE_NODE_Z_INDEX = "UPDATE_NODE_Z_INDEX";
export const LOADING_NOTIFICATION = "LOADING_NOTIFICATION";

// when rf instance is updated, store a copy in our reducer under RFState
export const SYNC_RF_STATE = "SYNC_RF_STATE";

// Used to load RFState in our redux store to react flow's internal redux store
export const SET_UPDATE_RF_INSTANCE_FLAG = "SET_UPDATE_RF_INSTANCE_FLAG";

export const SET_UNDO_REDO_FLAG = "SET_UNDO_REDO_FLAG";
