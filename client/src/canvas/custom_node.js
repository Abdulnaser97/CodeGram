import { Handle, useStore } from "react-flow-renderer";
import { Resizable } from "re-resizable";
import styled from "styled-components";

import "./nodeStyles.css";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { theme } from "../Themes";
import { useDispatch } from "react-redux";

import GitHub from "../Landing/GitHub";

import { loadRepoFromPublicURL } from "../Redux/actions/loadDiagram";
import PlusSign from "../Media/PlusSign";
import LearnMore from "../Landing/LearnMoreButton";
import Demo from "../Landing/DemoButton";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
const zoomSelector = (s) => s.transform[2];

// TODO: need to store data from here in state then dispatch to
// the react elemnts array when done typing/editing
const CustomNodeComponent = (props) => {
  const zoom = useStore(zoomSelector);
  const showContent = zoom * 4 >= props.data.zoomSensitivity;
  const [width, setWidth] = useState(props.data.width ? props.data.width : 120);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 70
  );
  let longText =
    props.data.label && props.data.label.length > 20 ? true : false;
  let mediumText =
    props.data.label && props.data.label.length > 15 ? true : false;
  const [fontSize, setFontSize] = useState(
    `${width / (longText ? 400 : mediumText ? 300 : 220)}em`
  );
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));

  const focusInput = useRef();

  useEffect(() => {
    if (focusInput.current && isEditing) {
      focusInput.current.focus();
    }
  }, [focusInput, isEditing]);

  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "FileNode") setSelected("highlightedNode");
    } else {
      setSelected("");
    }

    if (props.selected !== props.id) {
      setIsEditing(false);
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  function editButtonHandler(event) {
    event.preventDefault();
    setIsEditing(true);
    props.data.nodeLinkHandler(event);
  }

  useEffect(() => {
    setIsEditing(false);
  }, [props.data]);

  return (
    <div
      style={{
        backgroundColor:
          showContent && props.data.parentFlag ? "transparent" : "white",
        borderRadius: `${handleSize * 1.4}px`,
        display:
          zoom * 4 >= props.data.zoomSensitivity / 1.3 || !props.data.childFlag
            ? "block"
            : "none",
      }}
    >
      {props.selected && (
        <div
          className="node-button corner"
          onClick={(event) => {
            editButtonHandler(event);
          }}
        >
          <div
            style={{
              marginTop: `-${handleSize * 1.1}px`,
              marginRight: `-${handleSize * 1.1}px`,
              width: `${handleSize * 1.1}px`,
              height: `${handleSize * 1.1}px`,
              borderRadius: `${handleSize * 1.1}px`,
            }}
          >
            <PlusSign className="PlusSign" />
          </div>
        </div>
      )}

      <Resizable
        className={`${props.data.type} ${selected}`}
        size={{ width, height }}
        onResizeStart={(e, direction, ref, d) => {
          ref.className = `${props.data.type} nodrag`;
        }}
        onResize={(e, direction, ref, d) => {
          setFontSize(
            `${
              Math.sqrt(
                Math.pow(height + d.height, 2) + Math.pow(width + d.width, 2)
              ) / (longText ? 400 : mediumText ? 300 : 220)
            }em`
          );

          setHandleSize(Math.sqrt(height + d.height + width + d.width));

          setBorderRadius(
            `${Math.min(width + d.width, height + d.height) / 12}px`
          );
        }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
          setHeight(height + d.height);

          ref.className = `${props.data.type}`;
        }}
        minWidth={60}
        minHeight={30}
        style={{
          "border-radius": borderRadius,
        }}
        grid={[15, 15]}
        handleStyles={
          props.selected
            ? {
                bottomRight: {
                  marginBottom: `-${handleSize}px`,
                  marginRight: `-${handleSize}px`,
                  bottom: "0",
                  right: "0",
                  cursor: "nwse-resize",
                  width: `${handleSize / 1.2}px`,
                  height: `${handleSize / 1.2}px`,
                  borderRadius: `${handleSize / 1.2}px`,
                  zIndex: 1,
                },
              }
            : false
        }
        handleClasses={props.selected ? { bottomRight: "resizeHandle" } : false}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        {showContent && props.data.parentFlag && (
          <div className="node-label corner">
            {props.data.label && !isEditing ? (
              <>{props.data.label}</>
            ) : (
              <input
                placeholder="wrapper"
                // onChange={handleSearch}
                onKeyUp={handleNewNodeName}
                ref={focusInput}
                autoFocus
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
            )}
          </div>
        )}

        {(!showContent || !props.data.parentFlag) && (
          <div
            style={{
              display: "flex",
              "justify-content": "center",
              "align-items": "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              fontWeight="Medium"
              style={{ "font-size": fontSize }}
              textAlign="center"
            >
              {!isEditing && props.data.label ? (
                props.data.label
              ) : (
                <input
                  placeholder="__"
                  ref={focusInput}
                  autoFocus
                  onKeyUp={handleNewNodeName}
                  key="input"
                  style={{
                    "z-index": 0,
                    border: "none",
                    textAlign: "center",
                    fontSize: "80%",
                    outline: "none",
                    width: "70%",
                    padding: "none",
                    background: "transparent",
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: theme.typography.fontWeightMedium,
                    color: theme.palette.primary.darkestGrey,
                  }}
                />
              )}
            </Typography>
          </div>
        )}
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
    </div>
  );
};

// dashed border node
const WrapperNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 300);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const zoom = useStore(zoomSelector);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));
  const [isEditing, setIsEditing] = useState(true);
  const focusInput = useRef();

  useEffect(() => {
    if (focusInput.current && isEditing) {
      focusInput.current.focus();
    }
  }, [focusInput, isEditing]);

  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "DashedShape") setSelected("highlightedWrapper");
    } else {
      setSelected("");
    }

    if (props.selected != props.id) {
      setIsEditing(false);
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  useEffect(() => {
    setIsEditing(false);
  }, [props.data]);

  function editButtonHandler(event) {
    event.preventDefault();
    setIsEditing(true);
    props.data.nodeLinkHandler(event);
  }

  return (
    <div
      style={{
        display:
          zoom * 4 >= props.data.zoomSensitivity / 1.3 || !props.data.childFlag
            ? "block"
            : "none",
      }}
    >
      {props.selected && (
        <div
          className="node-button corner"
          onClick={(event) => {
            editButtonHandler(event);
          }}
        >
          <div
            style={{
              marginTop: `-${handleSize * 1.1}px`,
              marginRight: `-${handleSize * 1.1}px`,
              width: `${handleSize * 1.1}px`,
              height: `${handleSize * 1.1}px`,
              borderRadius: `${handleSize * 1.1}px`,
            }}
          >
            <PlusSign className="PlusSign" />
          </div>
        </div>
      )}

      <Resizable
        className={`${props.data.type} ${selected}`}
        size={{ width, height }}
        onResizeStart={(e, direction, ref, d) => {
          ref.className = `${props.data.type} nodrag`;
        }}
        onResize={(e, direction, ref, d) => {
          setFontSize(
            `${
              Math.sqrt(
                Math.pow(height + d.height, 2) + Math.pow(width + d.width, 2)
              ) / 200
            }em`
          );
          setHandleSize(Math.sqrt(height + d.height + width + d.width));

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
        grid={[15, 15]}
        handleStyles={
          props.selected
            ? {
                bottomRight: {
                  marginBottom: `-${handleSize}px`,
                  marginRight: `-${handleSize}px`,
                  bottom: "0",
                  right: "0",
                  cursor: "nwse-resize",
                  width: `${handleSize / 1.2}px`,
                  height: `${handleSize / 1.2}px`,
                  borderRadius: `${handleSize / 1.2}px`,
                  zIndex: 1,
                },
              }
            : false
        }
        handleClasses={props.selected ? { bottomRight: "resizeHandle" } : false}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className="node-label corner">
          {props.data.label && !isEditing ? (
            <div
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
            >
              {props.data.label}
            </div>
          ) : (
            <input
              placeholder="wrapper"
              // onChange={handleSearch}
              onKeyUp={handleNewNodeName}
              ref={focusInput}
              autoFocus
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
          )}
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
    </div>
  );
};

// Folder node
const FolderNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 300);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const zoom = useStore(zoomSelector);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("");
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));
  const [isEditing, setIsEditing] = useState(true);

  const focusInput = useRef();

  useEffect(() => {
    if (focusInput.current && isEditing) {
      focusInput.current.focus();
    }
  }, [focusInput, isEditing]);

  useEffect(() => {
    if (props.selected) {
      if (
        props.data.type === "CircleShape" ||
        props.data.type === "ShadowBoxShape"
      )
        setSelected("highlightedNode");
    } else {
      setSelected("");
    }

    if (props.selected != props.id) {
      setIsEditing(false);
    }
  }, [props.selected]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  function editButtonHandler(event) {
    event.preventDefault();
    setIsEditing(true);
    props.data.nodeLinkHandler(event);
  }

  useEffect(() => {
    setIsEditing(false);
  }, [props.data]);

  return (
    <div
      style={{
        display:
          zoom * 4 >= props.data.zoomSensitivity / 1.3 || !props.data.childFlag
            ? "block"
            : "none",
      }}
    >
      {props.selected && (
        <div
          className="node-button corner"
          onClick={(event) => {
            editButtonHandler(event);
          }}
        >
          <div
            style={{
              marginTop: `-${handleSize * 1.1}px`,
              marginRight: `-${handleSize * 1.1}px`,
              width: `${handleSize * 1.1}px`,
              height: `${handleSize * 1.1}px`,
              borderRadius: `${handleSize * 1.1}px`,
            }}
          >
            <PlusSign className="PlusSign" />
          </div>
        </div>
      )}

      <Resizable
        className={`${props.data.type} ${selected}`}
        size={{ width, height }}
        onResizeStart={(e, direction, ref, d) => {
          ref.className = `${props.data.type} nodrag`;
        }}
        onResize={(e, direction, ref, d) => {
          setFontSize(
            `${
              Math.sqrt(
                Math.pow(height + d.height, 2) + Math.pow(width + d.width, 2)
              ) / 200
            }em`
          );
          setHandleSize(Math.sqrt(height + d.height + width + d.width));

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
        grid={[15, 15]}
        handleStyles={
          props.selected
            ? {
                bottomRight: {
                  marginBottom: `-${handleSize}px`,
                  marginRight: `-${handleSize}px`,
                  bottom: "0",
                  right: "0",
                  cursor: "nwse-resize",
                  width: `${handleSize / 1.2}px`,
                  height: `${handleSize / 1.2}px`,
                  borderRadius: `${handleSize / 1.2}px`,
                  zIndex: 1,
                },
              }
            : false
        }
        handleClasses={props.selected ? { bottomRight: "resizeHandle" } : false}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className="node-label corner">
          {props.data.label && !isEditing ? (
            <>{props.data.label}</>
          ) : (
            <input
              placeholder="wrapper"
              // onChange={handleSearch}
              onKeyUp={handleNewNodeName}
              ref={focusInput}
              autoFocus
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
          )}
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
    </div>
  );
};

const CircleNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [selected, setSelected] = useState("");
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));

  const borderRadius = "50%";
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

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  return (
    <Resizable
      className={`${props.data.type} ${selected}`}
      size={{ width, height }}
      onResizeStart={(e, direction, ref, d) => {
        ref.className = `${props.data.type} nodrag`;
      }}
      onResize={(e, direction, ref, d) => {
        setHandleSize(Math.sqrt(height + d.height + width + d.width));
      }}
      onResizeStop={(e, direction, ref, d) => {
        setWidth(width + d.width);
        setHeight(height + d.height);

        ref.className = `${props.data.type}`;
      }}
      style={{ "border-radius": borderRadius }}
      grid={[15, 15]}
      handleStyles={
        props.selected
          ? {
              bottomRight: {
                marginBottom: `-${handleSize}px`,
                marginRight: `-${handleSize}px`,
                bottom: "0",
                right: "0",
                cursor: "nwse-resize",
                width: `${handleSize / 1.2}px`,
                height: `${handleSize / 1.2}px`,
                borderRadius: `${handleSize / 1.2}px`,
                zIndex: 1,
              },
            }
          : false
      }
      handleClasses={props.selected ? { bottomRight: "resizeHandle" } : false}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <div className="node-label corner">
        {props.data.label ? (
          <>{props.data.label}</>
        ) : (
          <input
            placeholder="wrapper"
            onKeyUp={handleNewNodeName}
            autoFocus
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
        )}
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

const HomeNodeComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  return (
    <Resizable
      className={`FileNode ${selected}`}
      size={{ width, height }}
      onResizeStart={(e, direction, ref, d) => {
        ref.className = `FileNode nodrag`;
      }}
      onResizeStop={(e, direction, ref, d) => {
        setWidth(width + d.width);
        setHeight(height + d.height);

        ref.className = `FileNode`;
      }}
      grid={[15, 15]}
      style={{ background: "white" }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          fontWeight="fontWeightMedium"
          style={{ "font-size": "30px" }}
          textAlign="center"
          color="secondary"
        >
          Welcome to CodeGram
        </Typography>
      </div>
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
    </Resizable>
  );
};

const LinkComponentWrapper = styled.div`
  position: relative;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

const LinkComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [selected, setSelected] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleURL(event) {
    setPublicUrl(event.target.value);
  }

  const getRepoFromLink = async () => {
    // extract repo name from public url
    dispatch(loadRepoFromPublicURL(publicUrl));
  };

  return (
    <LinkComponentWrapper>
      <input
        placeholder="Enter link to your public repo!"
        className="public-repo-link"
        onChange={handleURL}
      ></input>
      <Box
        mx={2}
        sx={{ "box-shadow": 0 }}
        style={{ height: "35px", marginLeft: "10px" }}
      >
        <div
          className="go-button"
          style={{ backgroundColor: "transparent" }}
          onClick={() => getRepoFromLink()}
        >
          <Box className="GoButtonWrapper" style={{ borderRadius: "35px" }}>
            <Typography
              mx={1}
              my={0.8}
              fontSize=".8vw"
              fontWeight="bold"
              color="primary"
              textAlign={"center"}
            >
              Go
            </Typography>
          </Box>
        </div>
      </Box>
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
    </LinkComponentWrapper>
  );
};

const SignUpComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 200);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 200
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  // api call import
  function login() {
    window.location.assign(`${REACT_APP_BACKEND_URL}/auth/github`);
  }

  return (
    <>
      <div
        style={{ height: "80%", width: "80%", marginTop: "-40px" }}
        className="GitHubButtonWrapper"
        onClick={login}
      >
        <GitHub className="GitHub" />
      </div>
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="destination"
        position="top"
        style={{
          ...sourceHandleStyle,
          backgroundColor: "transparent",
          // display: `${props.selected ? "block" : "none"}`,
        }}
      />
    </>
  );
};

const DocumentationComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 120);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 80
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  function goNotion() {
    window.location.assign(
      `https://pie-crepe-38f.notion.site/Documentation-cf20cbdf134247cb93bf6366d9055076`
    );
  }

  return (
    <>
      <div
        style={{ height: "80%", width: "80%", marginTop: "-40px" }}
        className="LearnMoreButtonWrapper"
        onClick={goNotion}
      >
        <LearnMore className="LearnMore" />
      </div>
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="destination"
        position="top"
        style={{
          ...sourceHandleStyle,
          backgroundColor: "transparent",
        }}
      />
    </>
  );
};

const DemoComponent = (props) => {
  const [width, setWidth] = useState(props.data.width ? props.data.width : 120);
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : 80
  );
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "CircleShape") setSelected("highlightedNode");
    } else {
      setSelected("");
    }
  }, [props.selected]);
  const [fontSize, setFontSize] = useState(`${width / 180}em`);
  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
  }, [height, width]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event);
  }

  function goNotion() {
    window.location.assign(`https://www.code-gram.com/?repo=CodeGram`);
  }

  return (
    <>
      <div
        style={{ height: "80%", width: "80%", marginTop: "-40px" }}
        className="LearnMoreButtonWrapper"
        onClick={goNotion}
      >
        <Demo className="LearnMore" />
      </div>
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="destination"
        position="top"
        style={{
          ...sourceHandleStyle,
          backgroundColor: "transparent",
        }}
      />
    </>
  );
};

export {
  CustomNodeComponent,
  WrapperNodeComponent,
  FolderNodeComponent,
  HomeNodeComponent,
  SignUpComponent,
  LinkComponent,
  CircleNodeComponent,
  DocumentationComponent,
  DemoComponent,
};
