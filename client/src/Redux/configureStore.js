import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
} from "redux";
import { RFStateReducer, nodesReducer } from "./reducers/nodesReducer";
import devToolsEnhancer from "remote-redux-devtools";
import {
  addNodeToArray,
  deleteNodeFromArray,
  sendToBack,
  bringToFront,
  setDoUpdateRFInternalInstance,
  setUndoRedoFlag,
} from "./actions/nodes";
import { fetchRepoFiles, storeRepoFiles } from "./actions/repoFiles";
import thunk from "redux-thunk";
import repoReducer from "./reducers/repoReducer";
import { loadDiagramToStore, syncRFState } from "./actions/loadDiagram";
import { notificationReducer } from "./reducers/notificationReducer";
import {
  successNotification,
  errorNotification,
  loadingNotification,
} from "./actions/notification";
import undoable, { includeAction } from "redux-undo";
import {
  ADD_NODE_TO_ARRAY,
  LOAD_DIAGRAM_TO_STORE,
  SYNC_RF_STATE,
} from "./constants";

const rootReducer = combineReducers({
  nodes: nodesReducer,
  repoFiles: repoReducer,
  RFState: RFStateReducer,
  notifications: notificationReducer,
});

const enhancers = [devToolsEnhancer({ realtime: true })];

// devToolsEnhancer is for the remote-redux chrome extension
// currently is not setup properly yet, but it doesn't impede anything, so you can ignore it for now
export const configureStore = () => {
  return createStore(
    undoable(rootReducer, {
      limit: 40, // set a limit for the size of the history
      filter: includeAction([ADD_NODE_TO_ARRAY]), // only store history for undo/redo when RFState is updated
    }),
    applyMiddleware(thunk)
  );
};

const ActionCreators = Object.assign(
  {},
  addNodeToArray,
  deleteNodeFromArray,
  sendToBack,
  bringToFront,
  setDoUpdateRFInternalInstance,
  fetchRepoFiles,
  storeRepoFiles,
  syncRFState,
  loadDiagramToStore,
  successNotification,
  errorNotification,
  loadingNotification,
  setUndoRedoFlag
);
export const mapStateToProps = (state) => ({
  nodes: state.nodes,
  repoFiles: state.repoFiles,
  RFState: state.RFState,
  notifications: {
    successNotificationMessage: state.successNotificationMessage,
    errorNotificationMessage: state.errorNotificationMessage,
    loadingNotificationMessage: state.loadingNotificationMessage,
  },
});
export const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
