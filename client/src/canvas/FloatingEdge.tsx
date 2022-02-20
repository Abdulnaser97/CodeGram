import { FC, useMemo, CSSProperties } from "react";
import {
  EdgeProps,
  getMarkerEnd,
  useStoreState,
  getSmoothStepPath,
  getEdgeCenter,
} from "react-flow-renderer";
import { setSelectedElements } from "react-flow-renderer/dist/store/actions";
import { theme } from "../Themes";

import { getEdgeParams } from "./utils";

const FloatingEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  arrowHeadType,
  markerEndId,
  style,
  selected,
}) => {
  const nodes = useStoreState((state) => state.nodes);
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const sourceNode = useMemo(
    () => nodes.find((n) => n.id === source),
    [source, nodes]
  );
  const targetNode = useMemo(
    () => nodes.find((n) => n.id === target),
    [target, nodes]
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const d = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    borderRadius: 20,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={d}
        markerEnd={markerEnd}
        style={style as CSSProperties}
      />
      <foreignObject
        width={40}
        height={40}
        x={edgeCenterX - 40/2}
        y={edgeCenterY - 40/2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body>
          <button
            className="edgebutton"
            onClick={(event) => console.log(`edge ${id} is ${selected}`)}
          >
            +
          </button>
        </body>
      </foreignObject>
    </>
  );
};

export default FloatingEdge;