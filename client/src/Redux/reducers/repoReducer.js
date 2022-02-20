import { 
  ADD_NODE_TO_ARRAY, 
  FETCH_REPO_FILES, 
  STORE_REPO_FILES, 
  DELETE_NODES_FROM_ARRAY, 
  UPDATE_REPO_FILE ,
  UPDATE_CODE_CONTENT,
} from "../constants";

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
    case UPDATE_REPO_FILE: {
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
      return {
        ...state,
        repoFiles: action.repoFiles,
      }
    };
    case UPDATE_CODE_CONTENT: {
      return {
        ...state,
        repoFiles: {
          ...state.repoFiles,
          [action.path]: {
            ...state.repoFiles[action.path],
            code: action.newCode, 
          }
        }
      }
    };
    default:
      return state;
  }
};

export default repoReducer;
