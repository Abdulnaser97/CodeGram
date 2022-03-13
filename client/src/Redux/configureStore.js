import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
} from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { RFStateReducer, nodesReducer } from "./reducers/nodesReducer";
import devToolsEnhancer from "remote-redux-devtools";
import {
  addNodeToArray,
  deleteNodeFromArray,
  sendToBack,
  bringToFront,
} from "./actions/nodes";
import {
  fetchRepoFiles,
  storeRepoFiles,
  updateRepoFileCodeContent,
} from "./actions/repoFiles";
import thunk from "redux-thunk";
import repoReducer from "./reducers/repoReducer";
import {
  loadDiagramToStore,
  loadRepoFromPublicURL,
  loadTemplateDiagram,
  reloadDiagram,
  setSourceDocTab,
} from "./actions/loadDiagram";
import { notificationReducer } from "./reducers/notificationReducer";
import {
  successNotification,
  errorNotification,
  loadingNotification,
} from "./actions/notification";

const rootReducer = combineReducers({
  nodes: nodesReducer,
  repoFiles: repoReducer,
  RFState: RFStateReducer,
  notifications: notificationReducer,
});

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

// devToolsEnhancer is for the remote-redux chrome extension
// currently is not setup properly yet, but it doesn't impede anything, so you can ignore it for now
export const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

const ActionCreators = Object.assign(
  {},
  addNodeToArray,
  deleteNodeFromArray,
  sendToBack,
  bringToFront,
  fetchRepoFiles,
  storeRepoFiles,
  updateRepoFileCodeContent,
  loadDiagramToStore,
  successNotification,
  errorNotification,
  loadingNotification,
  loadRepoFromPublicURL,
  loadTemplateDiagram,
  reloadDiagram,
  setSourceDocTab
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
