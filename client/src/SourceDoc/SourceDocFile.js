import AddBoxIcon from "@mui/icons-material/AddBox";
import CodeIcon from "@mui/icons-material/Code";
import FolderIcon from "@mui/icons-material/Folder";
import { mapDispatchToProps, mapStateToProps } from "../Redux/configureStore";
import { connect } from "react-redux";
import { useReactFlow, OnNodesChange } from "react-flow-renderer";
import { realPos } from "../canvas/utils";
// export default function SourceDocFile(props) {
function SourceDocFile(props) {
  const { addNode, setOpenArtifact, openArtifact, addFileToNode, selectedEL } =
    props;
  var { file } = props;

  const { fitBounds, getNodes, setCenter } = useReactFlow();
  const rf = useReactFlow();
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
    displayClass = "unlinked";
  } else {
    displayClass = "linked";
  }

  // openArtifact must exist to match names
  var selected =
    openArtifact && openArtifact.name === file.name ? "selectedFile" : "";

  // displayClass = selected ? "" : displayClass

  function fileClickHandler(file) {
    setOpenArtifact(file);

    if (file) {
      var el = getNodes().find((node) =>
        node.data ? node.data.path === file.path : false
      );
      if (el) {
        var realNodePos = realPos(el, rf);
        const x = realNodePos.position.x + el.width / 2;
        const y = realNodePos.position.y + el.height / 2;

        const zoom = 1;
        // setCenter(x, y, { zoom, duration: 1000 });
        fitBounds(
          {
            x: realNodePos.position.x + el.width / 2,
            y: realNodePos.position.y,
            width: el.data.width,
            height: el.data.height,
          },
          {
            padding: 2,
            duration: 1000,
          }
        );
      }
    }
  }

  return (
    <div className={`SourceDocFile ${displayClass} ${selected}`}>
      <div
        onClick={() => fileClickHandler(file)}
        style={{ width: "100%", height: "100%", padding: "10px 5px" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="iconWrapper" style={{ marginRight: "10px" }}>
            {fileIcon}
          </div>
          <p
            style={{
              fontFamily: "Poppins-Bold",
              "font-size": "70%",
              color: "#25252",
              margin: 0,
            }}
          >
            {fileName}
          </p>
        </div>
      </div>
      <div className="iconWrapper" style={{ marginRight: "10px" }}>
        <AddBoxIcon
          fontSize="small"
          onClick={() => {
            if (selectedEL && !selectedEL.data.label) {
              addFileToNode(file);
            } else {
              addNode({ file: file, fromSD: true });
            }
            setOpenArtifact(file);
          }}
        />
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceDocFile);
