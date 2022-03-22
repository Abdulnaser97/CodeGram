import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  CustomNodeComponent,
  WrapperNodeComponent,
  FolderNodeComponent,
  HomeNodeComponent,
  LinkComponent,
  SignUpComponent,
  CircleNodeComponent,
} from "../canvas/custom_node";
import ReactFlow, {
  addEdge,
  useReactFlow,
  MarkerType,
  SmoothStepEdge,
  StraightEdge,
  StepEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
} from "react-flow-renderer";
import { useSelector } from "react-redux";
import {
  addNodeToArray,
  bringToFront,
  deleteNodeFromArray,
  sendToBack,
} from "../Redux/actions/nodes";

import { updateRepoFile } from "../Redux/actions/repoFiles";

import FloatingEdge from "../canvas/FloatingEdge.tsx";
import FloatingConnectionLine from "../canvas/FloatingConnectionLine.tsx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import CanvasFile from "./CanvasFile";
import { TextComponent } from "../canvas/text";

// import template from "../Templates/FullStackTemplate.json";
import ControlTemplate from "../Templates/ControlTemplate.json";
import {
  loadTemplateDiagram,
  reloadDiagram,
} from "../Redux/actions/loadDiagram";
import { errorNotification } from "../Redux/actions/notification";

var initialElements = ControlTemplate;

const edgeTypes = {
  default: SmoothStepEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  floating: FloatingEdge,
};

const getNodeId = () => `randomnode_${+new Date()}`;

/**
 *
 * Component Starts Here
 *
 *
 *
 *
 *
 **/
export function useReactFlowWrapper({
  dispatch,
  selectedShapeName,
  activeToolBarButton,
  setActiveToolBarButton,
  setOpenArtifact,
  openArtifact,
  search,
  setSearch,
  fuse,
}) {
  const {
    RFState,
    nodesZIndex,
    repository,
    isLoadTemplateDiagram,
    isReloadDiagram,
    sourceDocTab,
  } = useSelector((state) => {
    return {
      RFState: state.RFState,
      nodesZIndex: state.nodes.nodesZIndex,
      repository: state.repoFiles.repoFiles,
      isLoadTemplateDiagram: state.RFState.loadTemplateDiagram,
      isReloadDiagram: state.RFState.reloadDiagram,
      sourceDocTab: state.repoFiles.sourceDocTab,
    };
  });

  const [nodes, setNodes] = useState(
    initialElements.nodes ? initialElements.nodes : []
  );
  const [edges, setEdges] = useState(
    initialElements.edges ? initialElements.edges : []
  );

  const [nodeName, setNodeName] = useState("");
  // Selected node
  const [selectedEL, setSelectedEL] = useState(
    initialElements.nodes ? initialElements.nodes[0] : null
  );
  const yPos = useRef(0);
  const [rfInstance, setRfInstance] = useState(null);
  const [connectionStarted, setConnectionStarted] = useState(false);
  const [floatTargetHandle, setFloatTargetHandle] = useState(false); // This is a hacky method to force rendering
  const [contextMenu, setContextMenu] = useState(null);
  const [clipBoard, setClipBoard] = useState(null);
  const [selectedNodeEvent, setSelectedNodeEvent] = useState(null);
  const [requestUpdateZIndex, setRequestUpdateZIndex] = useState(false);
  const { project } = useReactFlow();
  const [tabValue, setTabValue] = useState(0);
  const [nameFlag, setNameFlag] = useState(false);
  const [newNodeId, setNewNodeId] = useState(null);
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const nodeTypes = useMemo(
    () => ({
      default: CustomNodeComponent,
      FileNode: CustomNodeComponent,
      DashedShape: WrapperNodeComponent,
      // CircleShape: FolderNodeComponent,
      CircleShape: CircleNodeComponent,
      ShadowBoxShape: FolderNodeComponent,
      circle: CustomNodeComponent,
      home: HomeNodeComponent,
      LinkComponent: LinkComponent,
      SignUpComponent: SignUpComponent,
      Text: TextComponent,
    }),
    []
  );

  // Projects event click position to RF coordinates
  function calculatePosition(
    event = null,
    rfInstance = null,
    oldPosition = null
  ) {
    let position = null;
    if (event) {
      if (rfInstance) {
        position = rfInstance.project({
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        position = { x: event.clientX, y: event.clientY };
      }
    } else if (oldPosition) {
      position = { x: oldPosition.x + 30, y: oldPosition.y + 30 };
    } else {
      position = { x: 500, y: 400 };
    }

    // Make coordinate a multiple of 15 so it snaps to grid
    position.x = Math.floor(position.x / 15) * 15;
    position.y = Math.floor(position.y / 15) * 15;
    return position;
  }
  // Add node function
  const addNode = useCallback(
    (props) => {
      var file = props.file ? props.file : null;
      var event = props.event ? props.event : null;
      var label = "";
      var position = calculatePosition(event, rfInstance);

      var shapeType = selectedShapeName.current;
      if (file) {
        shapeType = file.type === "dir" ? "DashedShape" : "FileNode";
      }

      let url =
        file && file.download_url !== undefined
          ? file.download_url
          : file && file.url !== undefined
          ? file.url
          : null;

      const html_url = file && file.html_url ? file.html_url : null;

      const newNode = {
        id: getNodeId(),
        data: {
          label: file && file.name !== undefined ? file.name : label,
          name: file && file.name !== undefined ? file.name : label,
          linkedFiles: ["aa.py", "gg.py", "kookoo.py"],
          childNodes: ["da", "de", "do"],
          siblingNodes: ["ta", "te", "to"],
          parentNodes: ["pa", "pe"],
          documentation: ["url1", "url2"],
          description: "",
          url: url,
          html_url: html_url,
          path: file && file.path ? file.path : "",
          floatTargetHandle: false,

          // can set this type to whatever is selected in the tool bar for now
          // but the type will probably be set from a few different places
          type: shapeType,
          width:
            selectedShapeName.current &&
            selectedShapeName.current === "CircleShape"
              ? 100
              : Math.floor(100 / 15) * 15,
          height:
            selectedShapeName.current &&
            selectedShapeName.current === "CircleShape"
              ? 100
              : Math.floor(70 / 15) * 15,
          nodeInputHandler: nodeInputHandler,
          nodeLinkHandler: nodeLinkHandler,
        },
        type: shapeType,
        width:
          selectedShapeName.current &&
          selectedShapeName.current === "CircleShape"
            ? 100
            : Math.floor(100 / 15) * 15,
        height:
          selectedShapeName.current &&
          selectedShapeName.current === "CircleShape"
            ? 100
            : Math.floor(70 / 15) * 15,
        position: project({
          x: props.fromSD ? position.x : event?.clientX,
          y: props.fromSD ? position.y : event?.clientY,
        }),
        animated: true,
      };
      dispatch(addNodeToArray(newNode));
      // TODO: Change to setNodes((ns) => applyNodeChanges(changes, ns))
      // Need to figure out the changes type for adding a node
      setNodes((ns) => ns.concat(newNode));
      setNewNodeId(newNode.id);
    },
    [setNodes, nodeName, dispatch, project]
  );

  // Add node function
  const addText = useCallback(
    (props) => {
      var event = props.event ? props.event : null;
      var label = "";
      var position = calculatePosition(event, rfInstance);

      var shapeType = selectedShapeName.current;

      const newText = {
        id: getNodeId(),
        data: {
          label: label,
          name: label,
          type: shapeType,
          requestEdit: false,
          width: null,
          fontSize: null,
          height: Math.floor(150 / 15) * 15,
          nodeInputHandler: nodeInputHandler,
        },
        type: shapeType,
        height: Math.floor(150 / 15) * 15,
        width: Math.floor(350 / 15) * 15,
        position: project({
          x: position.x,
          y: position.y,
        }),
        animated: true,
      };
      dispatch(addNodeToArray(newText));
      setNodes((ns) => ns.concat(newText));
      setNewNodeId(newText.id);
    },
    [setNodes, nodeName, dispatch, project]
  );

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    setSelectedEL(node);
    setSelectedNodeEvent(event);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "elementMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setSelectedEL(edge);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "elementMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleContextMenuClose = (event) => {
    setContextMenu(null);
    setSelectedNodeEvent(null);
    setContextFiles(null);
    setNodeName("");
  };

  const handlePaneContextMenu = (event) => {
    event.preventDefault();
    if (clipBoard) {
      clipBoard.position.x = event.clientX;
      clipBoard.position.y = event.clientY;
      setClipBoard(clipBoard);
    }
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            type: "paneMenu",
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  // get stat
  const onElementClick = (event, element) => {
    console.log("click", element);
    setSelectedEL(element);
    element.data.selected = true;
  };

  const onPaneClick = async (event) => {
    if (nodeName || text) {
      setNameFlag(true);
    } else {
      setSelectedEL(null);
      // handleContextMenuClose();
    }
    if (activeToolBarButton === "selectShape") {
      await addNode({ event: event });
      setActiveToolBarButton("cursor");
    } else if (activeToolBarButton === "TextIcon") {
      await addText({ event: event });
      setActiveToolBarButton("cursor");
    }
  };

  const onNodesChange = useCallback(
    (changes) => {
      try {
        changes.forEach((change) => {
          switch (change.type) {
            case "remove":
              const nodeToRemove = nodes.find((node) => node.id === change.id);
              dispatch(deleteNodeFromArray([nodeToRemove]));
              setOpenArtifact("");
              break;
            default:
              break;
          }
        });

        setNodes((ns) => applyNodeChanges(changes, ns));
      } catch (e) {
        console.log(e);
      }
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      try {
        changes.forEach((change) => {
          switch (change.type) {
            case "remove":
              const edgeToRemove = nodes.find((node) => node.id === change.id);
              dispatch(deleteNodeFromArray([edgeToRemove]));
              setOpenArtifact("");
              break;
            default:
              break;
          }
        });

        setEdges((es) => applyEdgeChanges(changes, es));
      } catch (e) {
        console.log(e);
      }
    },
    [setEdges]
  );

  const onConnect = useCallback((connection) => {
    setEdges((eds) =>
      addEdge(
        // TODO : lookinto styling floating edges  and smoothstep
        {
          ...connection,
          id: getNodeId(),
          type: "floating",
          MarkerType: MarkerType.Arrow,
          data: {
            label: "new label",
            wiki: "",
          },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: "#FFCC00", color: "#fff", fillOpacity: 1 },
          labelShowBg: true,
        },
        eds
      )
    );
  });

  // Updates zIndex of all nodes
  useEffect(() => {
    setNodes((ns) =>
      ns.map((el) => {
        nodesZIndex.forEach((nodeId, index) => {
          if (el.id === nodeId) {
            let newIndex = index + 7;
            newIndex = newIndex.toString();
            el.style = { ...el.style, zIndex: newIndex };
          }
        });
        return el;
      })
    );
    setRequestUpdateZIndex(false);
  }, [nodesZIndex, requestUpdateZIndex]);

  const onConnectStart = (event, { nodeId, handleType }) => {
    setConnectionStarted(true);
  };
  const onConnectStop = (event) => {
    setFloatTargetHandle(false);

    setConnectionStarted(false);
  };
  const onConnectEnd = (event) => {
    event.target.style.zIndex = -1;
    setFloatTargetHandle(false);
    setConnectionStarted(false);
  };

  const onNodeMouseEnter = (event, node) => {
    if (connectionStarted && !floatTargetHandle) {
      node.data.floatTargetHandle = true;
      setFloatTargetHandle(true);
    }
  };

  const onNodeMouseMove = (event, node) => {
    if (!connectionStarted && floatTargetHandle) {
      node.data.floatTargetHandle = false;
      setFloatTargetHandle(false);
    }
  };

  const onNodeMouseLeave = (event, node) => {
    node.data.floatTargetHandle = false;
    setFloatTargetHandle(false);
  };

  const onNodeContextMenuDelete = (event) => {
    event.preventDefault();
    //TODO: Change to onNodeChange or applyNodeChanges and pass in delete change
    //onElementsRemove([selectedEL]);
    handleContextMenuClose();
  };

  const onNodeBringToFront = async (event) => {
    event.preventDefault();
    await dispatch(bringToFront(selectedEL));
    setRequestUpdateZIndex(true);

    handleContextMenuClose();
  };

  const onNodeSendToBack = async (event) => {
    event.preventDefault();
    await dispatch(sendToBack(selectedEL));
    setRequestUpdateZIndex(true);
    handleContextMenuClose();
  };

  const onCopy = (event = null) => {
    if (
      selectedEL &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "DIV"
    ) {
      if (event) {
        event.preventDefault();
      }

      let copyEl = JSON.parse(JSON.stringify(selectedEL));
      setClipBoard(copyEl);

      if (event) {
        handleContextMenuClose();
      }
    }
  };

  const onPaste = (event = null) => {
    if (event) {
      event.preventDefault();
    }
    if (clipBoard) {
      let newNode = clipBoard;
      newNode.id = getNodeId();
      newNode.position = calculatePosition(event, rfInstance, newNode.position);
      newNode.data = {
        ...newNode.data,
        path: "",
        nodeInputHandler: nodeInputHandler,
        nodeLinkHandler: nodeLinkHandler,
      };

      setNodes([...nodes, newNode]);
      dispatch(addNodeToArray(newNode));
    }
    if (event) {
      handleContextMenuClose();
    }
  };

  const keydownHandler = (e) => {
    // Ctrl + C (Cmd + C) for copy
    if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
      onCopy();
    }

    // Ctrl + V (Cmd + V) for paste
    if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
      if (clipBoard) {
        onPaste();
      }
    }

    // backspace for delete
    if (e.keyCode === 8) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.tagName !== "DIV"
      ) {
        //TODO: Change to onNodeChange or applyNodeChanges and pass in delete change
        //onElementsRemove([selectedEL]);
      }
    }

    // [ key for send to back
    if (e.keyCode === 219) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.tagName !== "DIV"
      ) {
        dispatch(sendToBack(selectedEL));
        setRequestUpdateZIndex(true);
      }
    }

    // ] key for bring to front
    if (e.keyCode === 221) {
      if (
        selectedEL &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.tagName !== "DIV"
      ) {
        dispatch(bringToFront(selectedEL));
        setRequestUpdateZIndex(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  const addFileToNode = (file) => {
    console.log(selectedEL);
    var selEl = null;
    // if (selectedEL?.data?.label){
    //   repository[selectedEL?.data?.path]
    // }
    var oldPath = selectedEL?.data?.path;
    console.log(file.type);
    // TODO: need to check if node or edges
    // if node, use setNodes
    // if edge, use setEdges
    setNodes((els) =>
      els.map((el) => {
        if (el.id === selectedEL.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el.data = {
            ...el.data,
            label: file.name,
            url:
              file && file.download_url !== undefined
                ? file.download_url
                : file && file.url !== undefined
                ? file.url
                : null,
            path: file && file.path ? file.path : "",
            floatTargetHandle: false,

            // can set this type to whatever is selected in the tool bar for now
            // but the type will probably be set from a few different places
            // will have to reload the node as a new component if its not the same
            // type: () => {
            //   if (file.type == "file") return "FileNode";
            //   else return el.data.type;
            //   // else if (file.type == "dir") return "DashedShape";
            //   // else return el.data.type;
            //   // file ? "FileNode" : selectedShapeName.current
            // },
          };
          selEl = el;
        }

        return el;
      })
    );
    handleContextMenuClose();
    setSelectedEL(selEl);
    dispatch(updateRepoFile(selEl, oldPath));
  };

  const setter = (value) => {
    // TODO: need to check if node or edges
    // if node, use setNodes
    // if edge, use setEdges
    setNodes((els) =>
      els.map((el) => {
        if (el.id === selectedEL.id) {
          el.data = {
            ...el.data,
            label: value,
            requestEdit: false,
          };
          setSelectedEL(el);
          setNodeName("");
          if (selectedEL.data.type !== "Text") {
            setSearch("");
          } else {
            setText("");
          }
        }
        return el;
      })
    );
  };

  useEffect(() => {
    if (nameFlag && selectedEL && selectedEL.id) {
      if (text) {
        setter(text);
        setSelectedEL(null);
      } else if (nodeName) {
        setter(nodeName);
        setSelectedEL(null);
      }
    }
    setNameFlag(false);
  }, [nameFlag, selectedEL, search, text]);

  function nodeInputHandler(event, nodeType = "") {
    if (
      event.key === "Enter" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      setNameFlag(true);
    }
    if (nodeType === "Text") {
      setText(event.target.value);
    } else {
      setNodeName(event.target.value);
    }
  }

  const [searchContent, setSearchContent] = useState(null);
  const [contextFiles, setContextFiles] = useState(null);

  // search method called whenevr search var changes
  useEffect(() => {
    if (nodeName && !nodeName.length) {
      // TOOD: Close Context Menu
      // handleContextMenuClose();
      return;
    } else if (fuse && nodeName) {
      // nodeLinkHandler();
      var results = fuse.search(nodeName, { limit: 5 });
      var newResults = results.map((result) => result.item);
      setSearchContent(newResults);
    }
  }, [nodeName]);

  useEffect(() => {
    if (searchContent?.length) {
      var repoList = [];
      const files = searchContent;
      for (var f of files) {
        repoList.push(
          <CanvasFile
            setContextMenu={setContextMenu}
            addNode={addNode}
            setOpenArtifact={setOpenArtifact}
            file={repository[f.path]}
            openArtifact={openArtifact}
            selectedEL={selectedEL}
            addFileToNode={addFileToNode}
          />
        );
      }
      setContextFiles(repoList);
    }
  }, [searchContent]);

  const nodeLinkHandler = useCallback(
    (event) => {
      if (selectedEL) {
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 20,
                mouseY: event.clientY,
                type: "nodeLink",
              }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              null
        );
      }
    },
    [selectedEL, project]
  );

  function handleNodeDoubleClick(event, element) {
    if (element.data && element.data.type === "Text") {
      element.data.requestEdit = true;
      setIsEditing(!isEditing);
      // pass edit flag to text data to change text content on double click
    } else {
      setTabValue(1);
    }
  }

  useEffect(() => {
    if (newNodeId) {
      const newlyAddedNode = nodes.find((node) => node.id === newNodeId);
      if (newlyAddedNode) {
        //setSelectedElements([newlyAddedNode]);
        // TODO: replace with applyNodeChanges
        setSelectedEL(newlyAddedNode);
        setNewNodeId(null);
      }
    }
  }, [newNodeId, nodes]);

  useEffect(() => {
    if (isLoadTemplateDiagram) {
      // loading the node handler functions into the nodes as
      // actual compiled functions
      // TODO:need to recreate template diagram
      // then uncomment the stuff below
      setNodes(
        // template.nodes.map((el) => {
        //   el.data = {
        //     ...el.data,
        //     nodeInputHandler: nodeInputHandler,
        //     nodeLinkHandler: nodeLinkHandler,
        //   };
        //   return el;
        // })
        []
      );

      setEdges(
        //   template.edges.map((el) => {
        //     el.data = {
        //       ...el.data,
        //       nodeInputHandler: nodeInputHandler,
        //       nodeLinkHandler: nodeLinkHandler,
        //     };
        //     return el;
        //   })
        []
      );
      dispatch(loadTemplateDiagram(false));
      dispatch(reloadDiagram(false));
    }
  }, [isLoadTemplateDiagram]);

  useEffect(() => {
    setTabValue(sourceDocTab);
  }, [sourceDocTab]);

  return {
    render: (
      <div className="canvas">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onElementClick={onElementClick}
          snapToGrid
          snapGrid={[15, 15]}
          key="floating"
          onConnectStart={onConnectStart}
          onConnectStop={onConnectStop}
          onConnectEnd={onConnectEnd}
          connectionMode={"loose"}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onPaneClick={onPaneClick}
          selectNodesOnDrag={true}
          onNodeContextMenu={handleContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onPaneContextMenu={handlePaneContextMenu}
          minZoom={0.1}
          maxZoom={4}
          onNodeDoubleClick={handleNodeDoubleClick}
        >
          <MiniMap
            style={{
              position: "absolute",
              left: "30px",
              borderRadius: "30px",
            }}
          />
          <ReactFlowStoreInterface
            {...{
              RFState,
              setNodes,
              setEdges,
              isReloadDiagram,
              dispatch,
              nodeInputHandler,
              nodeLinkHandler,
            }}
          />
        </ReactFlow>
        <Menu
          variant="menu"
          disableAutoFocus
          disableAutoFocusItem
          autoFocus={false}
          open={contextMenu !== null}
          onClose={handleContextMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeContextMenuDelete}>
              <div className="menu-item">
                <div className="menu-text">Delete</div>
                <div className="shortcut-key">backspace</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeBringToFront}>
              <div className="menu-item">
                <div className="menu-text">Bring To Front</div>
                <div className="shortcut-key">]</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem onClick={onNodeSendToBack}>
              <div className="menu-item">
                <div className="menu-text">Send To Back</div>
                <div className="shortcut-key">[</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "elementMenu" && (
            <MenuItem
              onClick={onCopy}
              style={{ position: "relative", width: "15vw" }}
            >
              <div className="menu-item">
                <div className="menu-text">Copy Shape</div>
                <div className="shortcut-key">cmd/ctrl+c</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "paneMenu" && (
            <MenuItem
              onClick={onPaste}
              style={{ position: "relative", width: "15vw" }}
            >
              <div className="menu-item">
                <div className="menu-text">Paste Shape</div>
                <div className="shortcut-key">cmd/ctrl+v</div>
              </div>
            </MenuItem>
          )}
          {contextMenu !== null && contextMenu.type === "nodeLink" && (
            <div>
              <Typography
                variant="subtitle1"
                color="primary"
                textAlign={"center"}
              >
                {" "}
                Results{" "}
              </Typography>

              <div
                className="repoContainer"
                style={{
                  position: "relative",
                  maxHeight: "40vh",
                  minHeight: "10vh",
                  width: "15vw",
                  "overflow-y": "scroll",
                }}
              >
                {contextFiles}
              </div>
            </div>
          )}
        </Menu>
      </div>
    ),
    nodes: nodes,
    edges: edges,
    addNode: addNode,
    setNodes: setNodes,
    setEdges: setEdges,
    setNodeName: setNodeName,
    onNodesChange: onNodesChange,
    onEdgesChange: onEdgesChange,
    initialElements: initialElements,
    selectedEL: selectedEL,
    rfInstance: rfInstance,
    setSelectedEL: setSelectedEL,
    addFileToNode: addFileToNode,
    setTabValue: setTabValue,
    tabValue: tabValue,
  };
}

export function ReactFlowStoreInterface({
  RFState,
  setNodes,
  setEdges,
  isReloadDiagram,
  dispatch,
  nodeInputHandler,
  nodeLinkHandler,
}) {
  // Uncomment below to view reactFlowState
  //const reactFlowState = useStore((state) => state);

  const { setViewport } = useReactFlow();

  useEffect(() => {
    try {
      if (RFState && RFState.RFState.viewport && isReloadDiagram) {
        const { x, y, zoom } = RFState.RFState.viewport;
        if (RFState?.RFState?.nodes) {
          // loading the node handler functions into the nodes as
          // actual compiled functions
          // TODO: need to test if this works
          setNodes(
            RFState.RFState.nodes.map((el) => {
              el.data = {
                ...el.data,
                nodeInputHandler: nodeInputHandler,
                nodeLinkHandler: nodeLinkHandler,
              };
              return el;
            })
          );
        } else {
          setNodes([]);
        }
        if (RFState?.RFState?.edges) {
          setEdges(
            RFState.RFState.edges.map((el) => {
              el.data = {
                ...el.data,
                nodeInputHandler: nodeInputHandler,
                nodeLinkHandler: nodeLinkHandler,
              };
              return el;
            })
          );
        } else {
          setEdges([]);
        }

        setViewport({
          x: x || 0,
          y: y || 0,
          zoom: zoom || 0,
        });
        dispatch(reloadDiagram(false));
      }
    } catch (err) {
      console.log(err);
      dispatch(errorNotification(`Error parsing saved diagram!`));
    }
  }, [RFState, setNodes, setEdges, setViewport, isReloadDiagram]);

  return null;
}
