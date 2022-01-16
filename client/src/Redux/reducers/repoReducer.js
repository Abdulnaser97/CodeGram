import { ADD_NODE_TO_ARRAY, FETCH_REPO_FILES, STORE_REPO_FILES, DELETE_NODES_FROM_ARRAY } from "../constants";

const initialState = {
  repoFiles: [],
  isFetchingFiles: false,
};

const repoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPO_FILES:
      state.isFetchingFiles = true;
      return {
        ...state,
        isFetchingFiles: true,
      };
    case STORE_REPO_FILES:
      return {
        ...state,
        repoFiles: action.payload,
        isFetchingFiles: false,
      };
    case ADD_NODE_TO_ARRAY: {
      return {
        ...state,
        repoFiles: {
          ...state.repoFiles,
          [action.payload.data.path]: {
            ...state.repoFiles[action.payload.data.path],
            linked:true 
          }
        }
      }
    };
    case DELETE_NODES_FROM_ARRAY: {
      //TODO: doesnt work need to take nodes from action, loop through and modify
      //required files in repository 
      // return {
      //   ...state,
      //   repoFiles: {
      //     ...state.repoFiles,
      //     [action.payload.data.path]: {
      //       ...state.repoFiles[action.payload.data.path],
      //       linked: false
      //     }
      //   }
      // } 
    }
    default:
      return state;
  }
};

export default repoReducer;
