import { FC, useMemo, CSSProperties } from "react";
import {
  EdgeProps,
  useStore,
  getSmoothStepPath,
  ReactFlowState,
} from "react-flow-renderer";

import { getEdgeParams } from "./utils";

const nodeSelector = (s: ReactFlowState) => s.nodeInternals;

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, style }) => {
  const nodeInternals = useStore(nodeSelector);

  const sourceNode = useMemo(
    () => nodeInternals.get(source),
    [source, nodeInternals]
  );
  const targetNode = useMemo(
    () => nodeInternals.get(target),
    [target, nodeInternals]
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
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
      />
    </>
  );
};

export default FloatingEdge;
