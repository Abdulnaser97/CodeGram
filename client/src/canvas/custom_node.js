import React from "react";
import { Handle } from "react-flow-renderer";
import { Resizable } from "re-resizable";

import "./nodeStyles.css";
import { useState } from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { theme } from "../Themes";

const targetHandleStyle = {
  borderRadius: 5,
  background: "transparent",
  border: "transparent",
  zIndex: 999,
  width: "inherit",
  height: "inherit",
};

const sourceHandleStyle = {
  borderRadius: 10,
  background: theme.palette.primary.main,
  opacity: "70%",
  border: "transparent",
  zIndex: 999,
  height: "10px",
  width: "10px",
};

const CustomNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
    <Resizable
      className={`${props.data.type}`}
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
      <Handle
        className="handle target"
        id={`top-handle-${props.id}`}
        type="source"
        position="top"
        style={{ ...sourceHandleStyle, top: "-20px" }}
      />

      <Handle
        className="handle target"
        id={`target-handle-${props.id}`}
        type="target"
        style={{
          ...targetHandleStyle,
          "z-index": `${props.data.floatTargetHandle ? 9999 : -1}`,
        }}
      />
      {/* TODO: Create an X button to remove node */}
      {/* <button onClick={data.onElementsRemove}>X</button> */}
      <Typography
        color="primary.darkGrey"
        fontWeight="Medium"
        style={{ "font-size": fontSize }}
      >
        {props.data.label}
      </Typography>
      <Handle
        className="handle target"
        id={`bottom-handle-${props.id}`}
        type="source"
        position="bottom"
        style={{ ...sourceHandleStyle, bottom: "-20px" }}
      />
      <Handle
        className="handle source"
        id={`left-handle-${props.id}`}
        type="source"
        position="left"
        style={{ ...sourceHandleStyle, left: "-20px" }}
      />
      <Handle
        className="handle source"
        id={`right-handle-${props.id}`}
        type="source"
        position="right"
        style={{ ...sourceHandleStyle, right: "-20px" }}
      />
    </Resizable>
  );
};

// dashed border node
const WrapperNodeComponent = (props) => {
  return (
    <>
      <div className="node-label corner">{props.data.label}</div>
      <div className="square-container"></div>
    </>
  );
};

export { CustomNodeComponent, WrapperNodeComponent };
