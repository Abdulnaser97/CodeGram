import { getPublicRepo, getRepo } from "../../api/apiClient";
import {
  FETCH_REPO_FILES,
  STORE_REPO_FILES,
  UPDATE_REPO_FILE,
  UPDATE_CODE_CONTENT,
  UPDATE_REPO_FILE_LINK,
} from "../constants";
import { reloadDiagram } from "./loadDiagram";
import { loadingNotification, successNotification } from "./notification";

async function recursiveRepoBuilder(
  repoName,
  subRepo,
  subProcessedFiles,
  branch
) {
  for (const file of subRepo) {
    if (file.type === "dir") {
      const contents = await getRepo(repoName, file.path, branch);
      await recursiveRepoBuilder(
        repoName,
        contents.data,
        subProcessedFiles,
        branch
      );
      subProcessedFiles[file.path] = {
        name: file.name,
        contents: contents.data,
        type: file.type,
        path: file.path,
        url: file.download_url,
        html_url: file.html_url,
        linked: false,
      };
    } else {
      subProcessedFiles[file.path] = {
        name: file.name,
        type: file.type,
        path: file.path,
        url: file.download_url,
        html_url: file.html_url,
        linked: false,
      };
    }
  }
  return subProcessedFiles;
}

export const getRepoFiles = (repoName, branch) => async (dispatch) => {
  await dispatch(
    loadingNotification(`Retrieving ${repoName} files from GitHub ...`)
  );
  await dispatch(fetchRepoFiles());
  const newRepo = await getRepo(repoName, null, branch);
  const files = newRepo.data;
  var processedRepo = {};
  var processedFiles = await recursiveRepoBuilder(
    repoName,
    files,
    processedRepo,
    branch
  );
  await dispatch(storeRepoFiles(processedFiles));
  await dispatch(
    successNotification(`${repoName} files retrieved successfully!`)
  );
  await dispatch(reloadDiagram(true));
};

export const getPublicRepoFiles = (repoName, url) => async (dispatch) => {
  await dispatch(
    loadingNotification(`Retrieving ${repoName} files from GitHub ...`)
  );
  const processedFiles = await getPublicRepo(url);
  await dispatch(storeRepoFiles(processedFiles));
  await dispatch(
    successNotification(`${repoName} files retrieved successfully!`)
  );
  await dispatch(reloadDiagram(true));
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
export function updateRepoFile(node, oldPath) {
  return (dispatch, getState) => {
    const { repoFiles } = getState();

    console.log(oldPath);
    if (oldPath) repoFiles.repoFiles[oldPath].linked = false;

    dispatch({
      type: UPDATE_REPO_FILE,
      payload: node,
      repoFiles: repoFiles.repoFiles,
    });
  };
}

export function updateRepoFileCodeContent(path, newCode) {
  return {
    type: UPDATE_CODE_CONTENT,
    path: path,
    newCode: newCode,
  };
}

export function updatedRepoFileLinked(path, isLinked) {
  return (dispatch, getState) => {
    const { repoFiles } = getState();

    if (repoFiles.repoFiles[path]) {
      repoFiles.repoFiles[path].linked = isLinked;
      console.log(`${path} set to ${isLinked}`);
    };

    dispatch({
      type: UPDATE_REPO_FILE_LINK,
      repoFiles: repoFiles.repoFiles
    });
  };
}