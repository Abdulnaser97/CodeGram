import axios from "axios";
import { LOAD_DIAGRAM_TO_STORE } from "../constants";
import { storeRepoFiles } from "./repoFiles";

export const loadDiagram = (repoFiles) => async (dispatch) => {
  // const diagramFile = repoFiles.find((file) =>
  //   file.fileName.includes(".CodeGram")
  // );

  var diagramFile = null 
  for (const [key, value] of Object.entries(repoFiles)){
    if (key.includes(".CodeGram")){
        diagramFile = value
        break 
    }
  }
  
  if (diagramFile && diagramFile.url !== undefined) {
    // calls node url to get file content
    axios
      .get(diagramFile.url)
      .then(function (response) {
        // handle success
        // var workingRepo = { repoFiles }
        // for (const f of response.data.elements){
        //   if (f.data && repoFiles[f.data.path]){
        //     workingRepo[f.data.path].linked = true
        //   }
        // }
        // dispatch(storeRepoFiles(workingRepo))
        dispatch(loadDiagramToStore(response.data));
      })
      .catch(function (error) {
        // handle error
        console.log("loadDiagram: unable to load diagram. Error: ", error);
      });
  }
};

export function loadDiagramToStore(nodes) {
  return {
    type: LOAD_DIAGRAM_TO_STORE,
    payload: nodes,
  };
}
