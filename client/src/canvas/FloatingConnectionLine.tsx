import { FC } from "react";
import {
  getBezierPath,
  ConnectionLineComponentProps,
  Node,
  useReactFlow
} from "react-flow-renderer";

import { getEdgeParams, realPos } from "./utils";

const FloatingConnectionLine: FC<ConnectionLineComponentProps> = ({
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceNode,
}) => {

  var rf = useReactFlow(); 


  if (!sourceNode) {
    return null;
  }

  const targetNode = {
    id: "connection-target",
    position: { x: targetX, y: targetY },
    data: {}, //TODO: had to add the data field to prevent error
    __rf: { width: 1, height: 1, position: { x: targetX, y: targetY } },
  } as Node;

  // if (sourceNode.parentNode) { 
  //   var parent = rf.getNode(sourceNode.parentNode) 
  //   if (parent){
  //     sourceNode = {
  //       ...sourceNode,
  //       position: { 
  //         x: parent.position.x + sourceNode.position.x,
  //         y: parent.position.y + sourceNode.position.y, 
  //       } 
  //     }
  //   }
  // }

  // var node = {...sourceNode}
  // var realx = node.position.x
  // var realy = node.position.y
  // var pId = node.parentNode
  // while (pId){
  //   var parent = rf.getNode(pId) 
  //   if (parent){ 
  //     realx += parent?.position.x
  //     realy += parent?.position.y 
  //   }
  //   pId = parent?.parentNode
  // }
  // sourceNode = {
  //   ...sourceNode,
  //   position: { 
  //     x: realx,
  //     y: realy, 
  //   } 
  // }
  

  const { sx, sy } = getEdgeParams(realPos(sourceNode, rf), targetNode);

  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={d}
      />
      <circle
        cx={targetX}
        cy={targetY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
};

export default FloatingConnectionLine;
