import { useSelector } from "react-redux";
import { getAllRepo, getRepo } from "../../api/apiClient";
import { FETCH_REPO_FILES, STORE_REPO_FILES } from "../constants";

export const getRepoFiles = (repoName) => async (dispatch) => {
  dispatch(fetchRepoFiles());

  const newRepo = await getRepo(repoName);
  // const newFullRepo = await getAllRepo(repoName);
  // console.log(newFullRepo)
  // console.log(newRepo)

  const processedFiles = [];
  const files = newRepo.data

  

  for (const file of files){
    if (file.type === 'dir'){
      const contents = await getAllRepo(repoName,file.name);
      processedFiles.push({ 
        fileName: file.name, 
        contents: contents, 
        url: file.download_url 
      })
    } else {
      processedFiles.push({ 
        fileName: file.name, 
        url: file.download_url 
      })
    }

  }
  console.log(processedFiles)
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

async function recursiveRepoBuilder(subRepo, processedFiles){
  for (const file of subRepo){
    if (file.type === 'dir'){
      const contents = await getAllRepo(repoName,file.name);
      processedFiles.push({ 
        fileName: file.name, 
        contents: contents, 
        url: file.download_url 
      })
      recursiveRepoBuilder(processedFiles.at(-1), processedFiles)
    } else {
      processedFiles.push({ 
        fileName: file.name, 
        url: file.download_url 
      })
    }
  } 
}