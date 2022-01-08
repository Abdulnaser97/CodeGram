import axios from "axios";
import { LOAD_DIAGRAM_TO_STORE } from "../constants";

export const loadDiagram = (repoFiles) => async (dispatch) => {
  // const diagramFile = repoFiles.find((file) =>
  //   file.fileName.includes(".CodeGram")
  // );

  var diagramFile = null 
  for (const [key, value] of Object.entries(repoFiles)){
    if (key.includes(".CodeGram")){
        diagramFile = value
    }
  }
  
  if (diagramFile && diagramFile.url !== undefined) {
    // calls node url to get file content
    axios
      .get(diagramFile.url)
      .then(function (response) {
        // handle success
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
