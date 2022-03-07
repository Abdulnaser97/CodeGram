import { Handle } from "react-flow-renderer";
import { Resizable } from "re-resizable";

import "./nodeStyles.css";
import { useState } from "react";
import { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { theme } from "../Themes";
import { useDispatch } from "react-redux";

import GitHub from "../Landing/GitHub";

import { getPublicRepo, getRepo } from "../api/apiClient";
import { storeRepoFiles, fetchRepoFiles } from "../Redux/actions/repoFiles";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// api call import
function login() {
  window.location.assign(`${REACT_APP_BACKEND_URL}/auth/github`);
}

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
  const [newNodeName, setNewNodeName] = useState("");
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));

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
      {
        <Typography
          //color={props.selected ? "white" : "primary.darkGrey"}
          fontWeight="Medium"
          style={{
            "font-size": fontSize,
            "overflow-wrap": "anywhere",
            padding: "10% 10% 10% 10%",
          }}
          textAlign="center"
        >
          {props.data.label ? (
            props.data.label
          ) : (
            <input
              placeholder="__"
              // onChange={handleSearch}
              onKeyUp={handleNewNodeName}
              autoFocus
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
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));

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
        {props.data.label ? (
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
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));

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
        {props.data.label ? (
          <>{props.data.label}</>
        ) : (
          <input
            placeholder="wrapper"
            // onChange={handleSearch}
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
    >
      <div>
        <Typography
          fontWeight="Light"
          style={{ "font-size": fontSize }}
          textAlign="center"
          variant="h5"
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
    dispatch(fetchRepoFiles());
    var files = await getPublicRepo(publicUrl);
    console.log(files);
    dispatch(storeRepoFiles(files));
  };

  return (
    <>
      <input
        placeholder="Enter link to your public repo!"
        style={{
          borderRadius: "0.6vw",
          "padding-left": "20px",
          "padding-right": "20px",
          outline: "none",
          height: "5vh",
          width: "15vw",
          border: "1px solid #ffaea6",
          color: "#FFAEA6",
          background: "transparent",
          appearance: "none",
          cursor: "pointer",
          boxShadow: "-2.5px 4px 5px #c9c9c9",
        }}
        onChange={handleURL}
      ></input>
      <Box mx={2} sx={{ "box-shadow": 0 }}>
        <div
          className="navbar-button github"
          style={{ backgroundColor: "transparent" }}
          onClick={() => getRepoFromLink()}
        >
          <Box className="SaveButtonWrapper">
            <Typography
              mx={1}
              my={0.8}
              fontSize=".8vw"
              fontWeight="bold"
              color="primary"
              textAlign={"center"}
            >
              Go!
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
    </>
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

  return (
    <>
      <div
        style={{ height: "80%", width: "80%" }}
        className="GitHubButtonWrapper"
      >
        <GitHub className="GitHub" onClick={login} />
      </div>
      <Handle
        className="handle source"
        id={`top-handle-${props.id}`}
        type="source"
        position="top"
        style={{
          ...sourceHandleStyle,
          // display: `${props.selected ? "block" : "none"}`,
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
};
