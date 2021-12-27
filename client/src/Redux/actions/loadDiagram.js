import axios from "axios";
import { useSelector } from "react-redux";
import { getRepo } from "../../api/apiClient";
import { LOAD_DIAGRAM_TO_STORE } from "../constants";

export const loadDiagram = (repoFiles) => async (dispatch) => {
  const diagramFile = repoFiles.find((file) =>
    file.fileName.includes(".CodeGram")
  );
  console.log(diagramFile);

  if (diagramFile && diagramFile.url !== undefined) {
    // calls node url to get file content
    axios
      .get(diagramFile.url)
      .then(function (response) {
        // handle success
        console.log(response.data);
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
