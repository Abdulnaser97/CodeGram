import { getRepo } from "../../api/apiClient";
import { FETCH_REPO_FILES, STORE_REPO_FILES } from "../constants";

export const getRepoFiles = (repoName) => async (dispatch) => {
  dispatch(fetchRepoFiles());

  const newRepo = await getRepo(repoName);

  const processedFiles = [];
  newRepo.data.forEach((file) =>
    processedFiles.push({ fileName: file.name, url: file.download_url })
  );
  dispatch(storeRepoFiles(processedFiles));
};

export function fetchRepoFiles() {
  return {
    type: FETCH_REPO_FILES,
  };
}

export function storeRepoFiles(repoFiles) {
  return {
    type: STORE_REPO_FILES,
    payload: repoFiles,
  };
}
