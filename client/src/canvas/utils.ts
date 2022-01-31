import { Position, ArrowHeadType, Node, XYPosition } from "react-flow-renderer";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: Node,
  targetNode: Node
): XYPosition {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition,
  } = intersectionNode.__rf;
  const targetPosition = targetNode.__rf.position;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

function getMiddleNodeIntersection(
  intersectionNode: Node,
  targetNode: Node
): XYPosition {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition,
  } = intersectionNode.__rf;

  const {
    width: targetNodeWidth,
    height: targetNodeHeight,
    position: targetNodePosition,
  } = targetNode.__rf;

  const iw = intersectionNodeWidth / 2;
  const ih = intersectionNodeHeight / 2;

  const tw = targetNodeWidth / 2;
  const th = targetNodeHeight / 2;

  const x2 = intersectionNodePosition.x + iw;
  const y2 = intersectionNodePosition.y + ih;
  const x1 = targetNodePosition.x + tw;
  const y1 = targetNodePosition.y + th;

  const xx1 = (x1 - x2) / (2 * iw) - (y1 - y2) / (2 * ih);
  const yy1 = (x1 - x2) / (2 * iw) + (y1 - y2) / (2 * ih);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = (iw / 1.5) * (xx3 + yy3) + x2;
  const y = (ih / 1.5) * (-xx3 + yy3) + y2;

  // if target node is much higher or lower than source node
  // then handle should be top or bottom on source node
  if (Math.abs(y1 - y2) > Math.abs(x1 - x2)) {
    if (y2 > y1) {
      return { x: x, y: y2 - ih };
    } else {
      return { x: x, y: y2 + ih };
    }
    // if target node is much more to the left or right than source node
    // then handle should be left or right on source node
  } else {
    if (x2 > x1) {
      return { x: x2 - iw, y: y };
    } else {
      return { x: x2 + iw, y: y };
    }
  }
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: Node, intersectionPoint: XYPosition) {
  const n = { ...node.__rf.position, ...node.__rf };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  let sourceIntersectionPoint = getMiddleNodeIntersection(source, target);
  let targetIntersectionPoint = getMiddleNodeIntersection(target, source);

  // fit to straight line if source and target interstection is different by less than 5px
  if (
    sourceIntersectionPoint.x >= targetIntersectionPoint.x - 15 &&
    sourceIntersectionPoint.x <= targetIntersectionPoint.x + 15
  ) {
    targetIntersectionPoint.x = sourceIntersectionPoint.x;
  }

  if (
    sourceIntersectionPoint.y >= targetIntersectionPoint.y - 15 &&
    sourceIntersectionPoint.y <= targetIntersectionPoint.y + 15
  ) {
    targetIntersectionPoint.y = sourceIntersectionPoint.y;
  }

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function createElements() {
  const elements = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  elements.push({ id: "target", data: { label: "Target" }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    elements.push({
      id: `${i}`,
      data: { label: "Source" },
      position: { x, y },
    });

    elements.push({
      id: `edge-${i}`,
      target: "target",
      source: `${i}`,
      type: "floating",
      arrowHeadType: ArrowHeadType.Arrow,
    });
  }

  return elements;
}
