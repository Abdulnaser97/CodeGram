import { ADD_NODE_TO_ARRAY, SAVE_NODES_TO_FILE } from '../constants';

const initialState = {
    nodesArr: []
};

const nodesReducer = (state = initialState, action) => {
    switch (action.type) {case ADD_NODE_TO_ARRAY:
            return{
                ...state,
                nodesArr: [...state.nodesArr, action.payload]
            }
        default:
            return state;
    }
}

export default nodesReducer;