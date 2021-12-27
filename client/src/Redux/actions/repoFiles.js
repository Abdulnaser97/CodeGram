import { getRepo } from "../../api/apiClient";
import { FETCH_REPO_FILES, STORE_REPO_FILES } from "../constants";

async function recursiveRepoBuilder(repoName, subRepo) {
  var subProcessedFiles = [];
  for (const file of subRepo) {
    if (file.type === "dir") {
      const contents = await getRepo(repoName, file.path);
      var subFiles = recursiveRepoBuilder(repoName, contents.data);
      subProcessedFiles.push({
        fileName: file.name,
        contents: subFiles,
        url: file.download_url,
      });
    } else {
      subProcessedFiles.push({
        fileName: file.name,
        url: file.download_url,
      });
    }
  }
  return subProcessedFiles;
}

export const getRepoFiles = (repoName) => async (dispatch) => {
  dispatch(fetchRepoFiles());
  const newRepo = await getRepo(repoName, null);
  const files = newRepo.data;
  const processedFiles = await recursiveRepoBuilder(repoName, files);
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
