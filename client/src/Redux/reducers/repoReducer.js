import { FETCH_REPO_FILES, STORE_REPO_FILES } from "../constants";

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
        repoFiles: [action.payload],
        isFetchingFiles: false,
      };
    default:
      return state;
  }
};

export default repoReducer;
