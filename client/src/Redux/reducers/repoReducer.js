import {
  ADD_NODE_TO_ARRAY,
  FETCH_REPO_FILES,
  STORE_REPO_FILES,
  DELETE_NODES_FROM_ARRAY,
  UPDATE_REPO_FILE,
  UPDATE_CODE_CONTENT,
  LOAD_REPO_FROM_PUBLIC_URL,
  SET_SOURCE_DOC_TAB,
  UPDATE_REPO_FILE_LINK,
} from "../constants";

const initialState = {
  publicRepoURL: "",
  repoFiles: [],
  isFetchingFiles: false,
  sourceDocTab: 0,
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
            linked: true,
          },
        },
      };
    }
    case UPDATE_REPO_FILE: {
      console.log("updating repo file");
      return {
        ...state,
        repoFiles: {
          ...action.repoFiles,
          [action.payload.data.path]: {
            ...state.repoFiles[action.payload.data.path],
            linked: true,
          },
        },
      };
    }
    case UPDATE_REPO_FILE_LINK: {
      return {
        ...state,
        repoFiles: action.repoFiles,
      };
    }
    case DELETE_NODES_FROM_ARRAY: {
      return {
        ...state,
        repoFiles: action.repoFiles,
      };
    }
    case UPDATE_CODE_CONTENT: {
      return {
        ...state,
        repoFiles: {
          ...state.repoFiles,
          [action.path]: {
            ...state.repoFiles[action.path],
            code: action.newCode,
          },
        },
      };
    }
    case LOAD_REPO_FROM_PUBLIC_URL: {
      return {
        ...state,
        publicRepoURL: action.payload,
        isFetchingFiles: true,
      };
    }
    case SET_SOURCE_DOC_TAB: {
      return {
        ...state,
        sourceDocTab: action.payload,
      };
    }
    default:
      return state;
  }
};

export default repoReducer;
