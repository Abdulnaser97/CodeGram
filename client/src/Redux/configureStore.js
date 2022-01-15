import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
} from "redux";
import { RFStateReducer, nodesReducer } from "./reducers/nodesReducer";
import devToolsEnhancer from "remote-redux-devtools";
import { addNodeToArray, deleteNodeFromArray } from "./actions/nodes";
import { fetchRepoFiles, storeRepoFiles } from "./actions/repoFiles";
import thunk from "redux-thunk";
import repoReducer from "./reducers/repoReducer";
import { loadDiagramToStore } from "./actions/loadDiagram";
import { notificationReducer } from "./reducers/notificationReducer";
import { successNotification, errorNotification } from "./actions/notification";

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
  return createStore(rootReducer, applyMiddleware(thunk));
};

const ActionCreators = Object.assign(
  {},
  addNodeToArray,
  deleteNodeFromArray,
  fetchRepoFiles,
  storeRepoFiles,
  loadDiagramToStore,
  successNotification,
  errorNotification
);
export const mapStateToProps = (state) => ({
  nodes: state.nodes,
  repoFiles: state.repoFiles,
  RFState: state.RFState,
  notifications: {
    successNotificationMessage: state.successNotificationMessage,
    errorNotificationMessage: state.errorNotificationMessage,
  },
});
export const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
