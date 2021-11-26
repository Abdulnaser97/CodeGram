import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
} from "redux";
import nodesReducer from "./reducers/nodesReducer";
import devToolsEnhancer from "remote-redux-devtools";
import { addNodeToArray, deleteNodeFromArray } from "./actions/nodes";
import { fetchRepoFiles, storeRepoFiles } from "./actions/repoFiles";
import thunk from "redux-thunk";
import repoReducer from "./reducers/repoReducer";

const rootReducer = combineReducers({
  nodes: nodesReducer,
  repoFiles: repoReducer,
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
  storeRepoFiles
);
export const mapStateToProps = (state) => ({
  nodes: state.nodes,
  repoFiles: state.repoFiles,
});
export const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
