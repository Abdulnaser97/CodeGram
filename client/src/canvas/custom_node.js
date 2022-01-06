import React from "react";
import { Handle, useStoreState } from "react-flow-renderer";
import { Resizable } from "re-resizable";

import "./nodeStyles.css";
import { useState } from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { theme } from "../Themes";

const targetHandleStyle = {
  borderRadius: 5,
  background: theme.palette.primary.lightGrey,
  border: "transparent",
  zIndex: 999,
};

const sourceHandleStyle = {
  borderRadius: 5,
  background: theme.palette.primary.lightGrey,
  border: "transparent",
  zIndex: 999,
};

const CustomNodeComponent = (props) => {
  // const nodeElement = document.querySelector(
  //   `.react-flow__node[data-id="${props.id}"]`
  // );
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );

  var selected = props.selected ? 'highlightedNode' : ''


  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
    <div> 
     {props.data.type === 'square-container' && <div className="node-label corner">{props.data.label}</div>}
    <Resizable
      className={`${props.data.type} ${selected}`}
      size={{ width, height }}
      onResizeStart={(e, direction, ref, d) => {
        ref.className = `${props.data.type} nodrag`;
      }}
      onResize={(e, direction, ref, d) => {
        setFontSize(`${(width + d.width) / 200}em`);
        setBorderRadius(
          `${Math.min(width + d.width, height + d.height) / 12}px`
          );
        }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
          setHeight(height + d.height);
          
          ref.className = `${props.data.type}`;
        }}
        style={{ "border-radius": borderRadius }}
        >
     
     { props.data.type !== 'square-container' && 
      <Typography
        color={props.selected ? "white" : "primary.darkGrey"} 
        fontWeight="Medium"
        style={{ "font-size": fontSize }}
        >
        {props.data.label}
      </Typography> 
      }

      <Handle
        className="handle target"
        type="target"
        position="top"
        style={targetHandleStyle}
        />
      {/* TODO: Create an X button to remove node */}
      {/* <button onClick={data.onElementsRemove}>X</button> */}
      <Handle
        className="handle target"
        type="source"
        position="bottom"
        style={sourceHandleStyle}
        />
      <Handle
        className="handle source"
        type="target"
        position="left"
        style={targetHandleStyle}
        />
      <Handle
        className="handle source"
        type="source"
        position="right"
        style={sourceHandleStyle}
        />
    </Resizable>
        </div>
  );
};

// dashed border node
const WrapperNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );

  var selected = props.selected ? 'highlightedWrapper' : ''


  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
    <div> 
     <div className="node-label corner">{props.data.label}</div>
    <Resizable
      className={`${props.data.type} ${selected}`}
      size={{ width, height }}
      onResizeStart={(e, direction, ref, d) => {
        ref.className = `${props.data.type} nodrag`;
      }}
      onResize={(e, direction, ref, d) => {
        setFontSize(`${(width + d.width) / 200}em`);
        setBorderRadius(
          `${Math.min(width + d.width, height + d.height) / 12}px`
          );
        }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
          setHeight(height + d.height);
          
          ref.className = `${props.data.type}`;
        }}
        style={{ "border-radius": borderRadius }}
        >



      {/* TODO: Create an X button to remove node */}
      {/* <button onClick={data.onElementsRemove}>X</button> */}

    </Resizable>
        </div>
  );
};

export { CustomNodeComponent, WrapperNodeComponent };
