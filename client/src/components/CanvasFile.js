import AddBoxIcon from "@mui/icons-material/AddBox";
import CodeIcon from "@mui/icons-material/Code";
import Folder from "@mui/icons-material/Folder";
import FolderIcon from "@mui/icons-material/Folder";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";

// export default function SourceDocFile(props) {
function CanvasFile(props) {
  const {
    addNode,
    setOpenArtifact,
    openArtifact,
    addFileToNode,
    selectedEL,
    setContextMenu,
  } = props;
  var { file } = props;

  if (!file) {
    return <> </>;
  }
  // search results from fuse are returned as items
  file = file.item ? file.item : file;

  var fileName = file.name;
  var displayClass = "";
  var fileIcon = null;

  // cstyle lass rendering
  if (file.type !== "dir") {
    fileIcon = <CodeIcon fontSize="small" />;
  } else {
    fileName = "/" + fileName;
    fileIcon = <FolderIcon fontSize="small" />;
  }

  // cstyle lass rendering
  if (!file.linked) {
    displayClass = "canvasUnlinked";
  } else {
    displayClass = "canvasLinked";
  }

  // openArtifact must exist to match names
  var selected =
    openArtifact && openArtifact.name === file.name ? "selectedFile" : "";

  // displayClass = selected ? "" : displayClass

  function fileClickHandler(file) {
    setOpenArtifact(file);
  }

  return (
    <div className={`CanvasFile ${displayClass} ${selected}`}>
      <div
        onClick={(event) => {
          if (selectedEL && !file.linked) {
            addFileToNode(file);
            setOpenArtifact(file);
            setContextMenu(null);
            //     onPaneClick(event);
          }
        }}
        style={{ width: "100%", height: "100%", padding: "5px 2.5px" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="iconWrapper"
            style={{ marginRight: "10px", color: "grey" }}
          >
            {fileIcon}
          </div>
          <p
            style={{
              cursor: "default",
              fontFamily: "Poppins",
              "font-size": "60%",
              color: "#25252",
              width: "100%",
              "text-overflow": "ellipsis",
              margin: 0,
            }}
          >
            {fileName}
          </p>
        </div>
      </div>
      {/* <div className="iconWrapper" style={{ marginRight: "10px" }}>
        <AddBoxIcon
          fontSize="small"
          onClick={() => {
            if (selectedEL) {
              addFileToNode(file);
            }
            setOpenArtifact(file);
          }}
        />
      </div> */}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasFile);
