import { getRepo } from "../../api/apiClient";
import { FETCH_REPO_FILES, STORE_REPO_FILES, UPDATE_REPO_FILE } from "../constants";


async function recursiveRepoBuilder(repoName, subRepo, subProcessedFiles, branch){
  for (const file of subRepo){
    if (file.type === "dir"){
      const contents = await getRepo(repoName,file.path, branch);
      await recursiveRepoBuilder(repoName, contents.data, subProcessedFiles, branch)
      subProcessedFiles[file.path] = { 
        name: file.name, 
        contents: contents.data,
        type: file.type,
        path: file.path,   
        url: file.download_url,
        linked: false 
      }
    } else {
      subProcessedFiles[file.path] = { 
        name: file.name,  
        type: file.type, 
        path: file.path, 
        url: file.download_url, 
        linked: false 
      }
    }
  }
  return subProcessedFiles;
}

export const getRepoFiles = (repoName, branch) => async (dispatch) => {
  dispatch(fetchRepoFiles());
  const newRepo = await getRepo(repoName, null, branch);
  const files = newRepo.data;
  var processedRepo = {}
  var processedFiles = await recursiveRepoBuilder(repoName, files, processedRepo, branch);
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

// unused but leaving as example for now
export function updateRepoFile(path){ 
  return { 
    type: UPDATE_REPO_FILE,
    id: path,  
    payload: { data: {linked: true }}
  }
}