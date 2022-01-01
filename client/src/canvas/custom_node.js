import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

import "./nodeStyles.css";

const targetHandleStyle = { 
  borderRadius: 5, 
  background: "rgba(46, 13, 13)" 
}

const sourceHandleStyle = {
  borderRadius: 5,
};

const CustomNodeComponent = ({ data }) => {
  return (
      <div className={data.type} >
        <Handle className="handle target" type="target" position="top" style={targetHandleStyle} />
        {/* TODO: Create an X button to remove node */}
        {/* <button onClick={data.onElementsRemove}>X</button> */}
        <div className="node-label">{data.label}</div>
        <Handle className="handle target" type="source" position="bottom" style={sourceHandleStyle} />
        <Handle className="handle source" type="target" position="left" style={targetHandleStyle} />
        <Handle className="handle source" type="source" position="right" style={sourceHandleStyle} />
      </div>
  );
};

// dashed border node
const WrapperNodeComponent = ({ data }) => {
  return (
    <>
      <div className="node-label corner">{data.label}</div>
      <div className="square-container"></div>
    </>
  );
};

export { CustomNodeComponent, WrapperNodeComponent };
