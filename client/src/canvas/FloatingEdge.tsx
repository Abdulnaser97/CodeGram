import { FC, useMemo, CSSProperties, useCallback } from "react";
import {
  EdgeProps,
  useStore,
  getSmoothStepPath,
  ReactFlowState,
  useReactFlow
} from "react-flow-renderer";

import { getEdgeParams } from "./utils";

const nodeSelector = (s: ReactFlowState) => s.nodeInternals;

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, style, markerEnd }) => {
  var rf = useReactFlow();

  const nodeInternals = useStore(nodeSelector);

  // var sourceNode = useMemo(
  //   () => nodeInternals.get(source),
  //   [source, nodeInternals]
  // );
  // var targetNode = useMemo(
  //   () => nodeInternals.get(target),
  //   [target, nodeInternals]
  // );

  var sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  var targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }


  if (sourceNode.parentNode) { 
    var parent = rf.getNode(sourceNode.parentNode) 
    if (parent){
      sourceNode = {
        ...sourceNode,
        position: { 
          x: parent.position.x + sourceNode.position.x,
          y: parent.position.y + sourceNode.position.y, 
        } 
      }
    }
  }

  if (targetNode.parentNode) { 
    var parent = rf.getNode(targetNode.parentNode) 
    if (parent){
      targetNode = {
        ...targetNode,
        position: { 
          x: parent.position.x + targetNode.position.x,
          y: parent.position.y + targetNode.position.y, 
        } 
      }
    }
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
        markerEnd={markerEnd}
      />
    </>
  );
};

export default FloatingEdge;
