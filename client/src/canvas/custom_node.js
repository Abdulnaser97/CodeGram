import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

import "./nodeStyles.css";

const defaultNodeStyles = {
  borderColor: "#FFAEA6",
  color: "#6E6E6E",
  height: "2vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const squareContainerNodeStyles = {
  backgroundColor: "none",
  color: "#FF6666",
  fontWeight: "bold",
  height: "5vw",
  width: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed #FF6666",
  borderRadius: "5px",
};

const squareNodeStyles = {
  opacity: "1.0",
  height: "5vw",
  width: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #DEDEDE",
	borderRadius: "5px",
	background: "#FFFFFF",
};

const circleNodeStyles = {
  backgroundColor: "#EDF",
  color: "white",
  fontWeight: "bold",
  height: "7vw",
  width: "7vw",
  "border-radius": "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border:'none'
};

const cylinderNodeStyles = {
  position: "relative",
  margin: "0 auto",
  width: "100px",
  height: "150px",
  borderRadius: "50px/25px",
  backgroundColor: "rgba(160, 160, 160, 0.5)",
}

const targetHandleStyle = { 
  borderRadius: 5, 
  background: "rgba(46, 13, 13)" 
}

const sourceHandleStyle = {
  borderRadius: 5,
};

const nodeStyles = {
  "default": defaultNodeStyles,
  "square": squareNodeStyles,
  "squareContainer": squareContainerNodeStyles,
  "circle": circleNodeStyles,
  "cylinder": cylinderNodeStyles,
}

const CustomNodeComponent = ({ data }) => {
  return (
      <div style={nodeStyles[data.type]}>
        <Handle className="handle target" type="target" position="top" style={targetHandleStyle} />
        {/* TODO: Create an X button to remove node */}
        {/* <button onClick={data.onElementsRemove}>X</button> */}
        <div className="node-label">{data.label}</div>
        <Handle className="handle target" type="target" position="bottom" style={targetHandleStyle} />
        <Handle className="handle source" type="source" position="left" style={sourceHandleStyle} />
        <Handle className="handle source" type="source" position="right" style={sourceHandleStyle} />
      </div>
  );
};

// dashed border node
const SquareContainerNodeComponent = ({ data }) => {
  return (
    <div className="square-container">
      <Handle className="handle target" type="target" position="top" style={targetHandleStyle} />
      {/* TODO: Create an X button to remove node */}
      {/* <button onClick={data.onElementsRemove}>X</button> */}
      <div className="node-label">{data.label}</div>
      <Handle className="handle target" type="target" position="bottom" style={targetHandleStyle} />
      <Handle className="handle source" type="source" position="left" style={sourceHandleStyle} />
      <Handle className="handle source" type="source" position="right" style={sourceHandleStyle} />
    </div>
  );
};

const CylinderNode = ({ data }) => {
  return (
    <div className="cylinder">
      <Handle className="handle target" type="target" position="top" style={targetHandleStyle} />
      {/* TODO: Create an X button to remove node */}
      {/* <button onClick={data.onElementsRemove}>X</button> */}
      <div className="node-label">{data.label}</div>
      <Handle className="handle target" type="target" position="bottom" style={targetHandleStyle} />
      <Handle className="handle source" type="source" position="left" style={sourceHandleStyle} />
      <Handle className="handle source" type="source" position="right" style={sourceHandleStyle} />
    </div>
  );
};

export {nodeStyles, CustomNodeComponent, SquareContainerNodeComponent, CylinderNode};