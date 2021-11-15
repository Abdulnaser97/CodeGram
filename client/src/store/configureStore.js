import { createStore, combineReducers } from 'redux';
import countReducer from '../reducers/countReducer';
import nodesReducer from '../reducers/nodesReducer';
import devToolsEnhancer from 'remote-redux-devtools';

const rootReducer = combineReducers({
    count: countReducer,
    nodes: nodesReducer
});

// devToolsEnhancer is for the remote-redux chrome extension
// currently is not setup properly yet, but it doesn't impede anything, so you can ignore it for now
const configureStore = () => {
    return createStore(rootReducer, devToolsEnhancer({ realtime: true }));
}

export default configureStore;