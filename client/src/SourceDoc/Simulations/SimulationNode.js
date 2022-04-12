import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import CodeIcon from "@mui/icons-material/Code";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../Redux/configureStore";
import { connect, useDispatch } from "react-redux";
import { useReactFlow } from "react-flow-renderer";
import { removeNodeFromSimulation } from "../../Redux/actions/simulationActions";

function SimulationNode(props) {
  const { fitBounds, getNodes, getNode } = useReactFlow();
  // TODO: Uncomment
  const node = getNode(props.nodeId);

  // search results from fuse are returned as items
  // TODO: Uncomment
  var title = node ? node.data.label : props.nodeId;

  // openArtifact must exist to match names
  var selected = props.current === node.id ? "selectedFile" : "";

  const dispatch = useDispatch();

  function fileClickHandler(file) {
    console.log("TODO: show stored simulation info for this node");
  }

  return (
    <div className={`SourceDocFile linked ${selected}`}>
      <div
        onClick={() => fileClickHandler(node)}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Poppins-Bold",
              "font-size": "70%",
              color: "#25252",
              marginLeft: "5%",
            }}
          >
            {title}
          </p>
        </div>
      </div>
      <div
        className="iconWrapper"
        style={{ marginRight: "10px", cursor: "grab" }}
      >
        <DeleteRoundedIcon
          fontSize="small"
          onClick={() => {
            dispatch(removeNodeFromSimulation(node));
          }}
        />
      </div>
      <div
        className="iconWrapper"
        style={{ marginRight: "10px", cursor: "grab" }}
      >
        <DragHandleRoundedIcon
          fontSize="small"
          onClick={() => {
            console.log("TODO: draggable");
          }}
        />
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulationNode);
