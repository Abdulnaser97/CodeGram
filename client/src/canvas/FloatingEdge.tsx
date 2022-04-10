import { FC, useMemo, CSSProperties, useCallback } from "react";
import {
  EdgeProps,
  useStore,
  getSmoothStepPath,
  ReactFlowState,
  useReactFlow,
  Node
} from "react-flow-renderer";

import { getEdgeParams, realPos } from "./utils";

const nodeSelector = (s: ReactFlowState) => s.nodeInternals;

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, style, markerEnd }) => {
  var rf = useReactFlow();
  var sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  var targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }
 
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    realPos(sourceNode, rf),
    realPos(targetNode, rf)
  );

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
        style={style as CSSProperties}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default FloatingEdge;
