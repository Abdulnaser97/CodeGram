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
  zIndex: -1,
  width: "inherit",
  height: "inherit",
  top: "0px",
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

// TODO: need to store data from here in state then dispatch to
// the react elemnts array when done typing/editing
const CustomNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 120);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 70
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "FileNode") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
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
      {
        <Typography
          //color={props.selected ? "white" : "primary.darkGrey"}
          fontWeight="Medium"
          style={{ "font-size": fontSize }}
          textAlign="center"
        >
          {props.data.label ? (
            props.data.label
          ) : (
            <input
              placeholder="__"
              // onChange={handleSearch}
              // onKeyPress={handleSearch}
              style={{
                "z-index": 0,
                border: "none",
                textAlign: "center",
                fontSize: "100%",
                outline: "none",
                width: "80%",
                padding: "none",
                background: "transparent",
                fontFamily: theme.typography.fontFamily,
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.palette.primary.darkestGrey,
              }}
            />
          )}
        </Typography>
      }
      <Handle
        className="handle target"
        id={`target-handle-${props.id}`}
        type="target"
        style={{
          ...targetHandleStyle,
          "z-index": `${props.data.floatTargetHandle ? 9999 : -1}`,
        }}
      />
      {/* Only display handles when node is selected */}
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="source"
        position="top"
        style={{ 
          ...sourceHandleStyle, 
          top: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`bottom-handle-${props.id}`}
        type="source"
        position="bottom"
        style={{ 
          ...sourceHandleStyle, 
          bottom: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`left-handle-${props.id}`}
        type="source"
        position="left"
        style={{ 
          ...sourceHandleStyle, 
          left: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`right-handle-${props.id}`}
        type="source"
        position="right"
        style={{ 
          ...sourceHandleStyle, 
          right: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
    </Resizable>
  );
};

// dashed border node
const WrapperNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 300);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "DashedShape") setSelected("highlightedWrapper");
    } else {
      setSelected("");
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
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
      <div className="node-label corner">
        {props.data.label}
        <input
          placeholder="wrapper"
          // onChange={handleSearch}
          // onKeyPress={handleSearch}
          style={{
            "z-index": 0,
            border: "none",
            fontSize: "100%",
            outline: "none",
            width: "100%",
            background: "transparent",
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.primary.pinkerPink,
          }}
        />
      </div>
      <Handle
        className="handle target"
        id={`target-handle-${props.id}`}
        type="target"
        style={{
          ...targetHandleStyle,
          "z-index": `${props.data.floatTargetHandle ? 9999 : -1}`,
        }}
      />
      {/* Only display handles when node is selected */}
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="source"
        position="top"
        style={{ 
          ...sourceHandleStyle, 
          top: "-20px", 
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`bottom-handle-${props.id}`}
        type="source"
        position="bottom"
        style={{ 
          ...sourceHandleStyle, 
          bottom: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`left-handle-${props.id}`}
        type="source"
        position="left"
        style={{ 
          ...sourceHandleStyle, 
          left: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`right-handle-${props.id}`}
        type="source"
        position="right"
        style={{ 
          ...sourceHandleStyle, 
          right: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
    </Resizable>
  );
};

// Folder node
const FolderNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 300);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  return (
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
      <div className="node-label corner">
        {props.data.label}
        <input
          placeholder="wrapper"
          // onChange={handleSearch}
          // onKeyPress={handleSearch}
          style={{
            "z-index": 0,
            border: "none",
            fontSize: "70%",
            outline: "none",
            width: "100%",
            background: "transparent",
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeightRegular,
            color: theme.palette.primary.darkestGrey,
          }}
        />
      </div>
      <Handle
        className="handle target"
        id={`target-handle-${props.id}`}
        type="target"
        style={{
          ...targetHandleStyle,
          "z-index": `${props.data.floatTargetHandle ? 9999 : -1}`,
        }}
      />
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="source"
        position="top"
        style={{ 
          ...sourceHandleStyle, 
          top: "-20px", 
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`bottom-handle-${props.id}`}
        type="source"
        position="bottom"
        style={{ 
          ...sourceHandleStyle, 
          bottom: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`left-handle-${props.id}`}
        type="source"
        position="left"
        style={{ 
          ...sourceHandleStyle, 
          left: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
      <Handle
        className="handle source"
        id={`right-handle-${props.id}`}
        type="source"
        position="right"
        style={{ 
          ...sourceHandleStyle, 
          right: "-20px",
          display: `${props.selected ? "block" : "none"}`,
        }}
      />
    </Resizable>
  );
};

export { CustomNodeComponent, WrapperNodeComponent, FolderNodeComponent };
