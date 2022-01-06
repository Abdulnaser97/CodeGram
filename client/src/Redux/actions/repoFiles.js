import { getRepo } from "../../api/apiClient";
import { FETCH_REPO_FILES, STORE_REPO_FILES } from "../constants";

async function recursiveRepoBuilder(repoName, subRepo, subProcessedFiles){
  //var subProcessedFiles = {}
  for (const file of subRepo){
    if (file.type === "dir"){
      const contents = await getRepo(repoName,file.path);
      await recursiveRepoBuilder(repoName, contents.data, subProcessedFiles)
      subProcessedFiles[file.path] = { 
        name: file.name, 
        contents: contents.data,
        type: file.type,
        path: file.path,   
        url: file.download_url 
      }
    } else {
      subProcessedFiles[file.path] = { 
        name: file.name,  
        type: file.type, 
        path: file.path, 
        url: file.download_url 
      }
    }
  }
  return subProcessedFiles;
}

export const getRepoFiles = (repoName) => async (dispatch) => {
  dispatch(fetchRepoFiles());
  const newRepo = await getRepo(repoName, null);
  const files = newRepo.data;
  var processedRepo = {}
  var processedFiles = await recursiveRepoBuilder(repoName, files, processedRepo);
  //console.log(processedFiles)
  // processedFiles.repoName = {}
  // processedFiles.repoName.contents = {}
  // for (const [key,value] of Object.entries(processedFiles)){
  //   console.log(key)
  //   console.log(value)
  //   var count = (value.path.match(/\//g) || []).length;
  //   if (!count)
  //     processedFiles.repoName.contents[value.path] = value
  // }
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
