import react, { useState, useEffect } from "react";
import { getOutgoers, getIncomers, useReactFlow } from "react-flow-renderer";
import { Box, Typography } from "@mui/material";

import TextEditor from "../components/TextEditor.js";
import { theme } from "../Themes";

// TODO: needs extra click and click away to set the selectedEL to
// the properly updated one. Tried to resolve using setSelectedElements
// on saveWikiToNode

export default function DocsTab(props) {
  const {
    isEditing,
    setIsEditing,
    selectedEL,
    openArtifact,
    setNodes,
    setEdges,
    setSelectedEL,
  } = props;
  var rf = useReactFlow();

  const [wiki, setWiki] = useState(selectedEL ? selectedEL.data.wiki : "");
  const [ogs, setOgs] = useState([]);
  const [incs, setIncs] = useState([]);
  const [nodeParents, setNodeParents] = useState([]);
  const [newLabel, setNewLabel] = useState(
    selectedEL ? selectedEL.data.label : ""
  );
  useEffect(() => {
    if (selectedEL) {
      setWiki(selectedEL.data.wiki);
      setNewLabel(selectedEL.data.label);
      let node = rf.getNode(selectedEL.id);
      if (node) {
        setIncs(getIncomers(node, rf.getNodes(), rf.getEdges()));
        setOgs(getOutgoers(node, rf.getNodes(), rf.getEdges()));
        var pNode = node.parentNode;
        var parents = [];
        while (pNode) {
          let parent = rf.getNode(pNode);
          parents.push(parent);
          pNode = parent.parentNode;
        }
        setNodeParents(parents);
      }
    }
  }, [selectedEL]);

  const saveWikiToNode = () => {
    var selEl = null;
    // CHecks if edge with source attribute
    if (selectedEL?.source) {
      setEdges((els) =>
        els.map((el) => {
          if (selectedEL && el.id === selectedEL.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.data = {
              ...el.data,
              label: newLabel.toString(),
              wiki: wiki,
            };
            selEl = el;
          }

          return el;
        })
      );
    } else {
      setNodes((els) =>
        els.map((el) => {
          if (selectedEL && el.id === selectedEL.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.data = {
              ...el.data,
              label: newLabel.toString(),
              wiki: wiki,
            };
            selEl = el;
          }

          return el;
        })
      );
    }

    setSelectedEL(selEl);
  };

  const handleWikiChange = (data) => {
    setWiki(data);
  };

  const handleLabelChange = (event) => {
    setNewLabel(event.target.value);
  };

  const handleDoneOrEditClick = () => {
    if (isEditing) {
      if (selectedEL?.data?.wiki) setWiki(selectedEL.data.wiki);
      else setWiki("");
      if (selectedEL?.data?.label) setNewLabel(selectedEL.data.label);
      else setNewLabel("");
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div
        className="navbar-button github"
        style={{ position: "fixed", right: "1.5vw", "overflow-y": "auto" }}
        onClick={() => handleDoneOrEditClick()}
      >
        <Box className="EditWikiButtonWrapper">
          <Typography
            mx={1}
            my={0.8}
            fontSize=".8vw"
            fontWeight="Thin"
            color="primary"
          >
            {isEditing ? "Cancel" : "Edit"}
          </Typography>
        </Box>
      </div>
      {isEditing && (
        <div
          className="navbar-button github"
          style={{ position: "fixed", right: "6vw" }}
          onClick={() => {
            saveWikiToNode();
            setIsEditing(!isEditing);
          }}
        >
          <Box className="EditWikiButtonWrapper" mx={1}>
            <Typography
              mx={1}
              my={0.8}
              fontSize=".8vw"
              fontWeight="Thin"
              color="primary"
            >
              Save
            </Typography>
          </Box>
        </div>
      )}
      {selectedEL && selectedEL.data.label && !isEditing ? (
        <Typography variant="h5" fontWeight="bold">
          {selectedEL && selectedEL.data.label}
        </Typography>
      ) : (
        <input
          onClick={() => setIsEditing(true)}
          placeholder="Add name"
          onChange={handleLabelChange}
          value={newLabel}
          // onKeyPress={handleSearch}
          style={{
            "z-index": 0,
            border: "none",
            outline: "none",
            fontSize: "3vh",
            width: "80%",
            padding: "none",
            background: "transparent",
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeightMedium,
            color: "black",
          }}
        />
      )}

      <Typography variant="h6">
        <a href={openArtifact && openArtifact.html_url} target="_blank">
          {" "}
          source code link{" "}
        </a>
      </Typography>
      <Typography my={1} variant="h6">
        Wiki
      </Typography>

      <div className="text-editor-container">
        {isEditing ? (
          <TextEditor
            content={
              selectedEL && selectedEL.data.wiki ? selectedEL.data.wiki : ""
            }
            onChange={handleWikiChange}
          />
        ) : wiki?.length ? (
          <div
            dangerouslySetInnerHTML={{
              __html: wiki,
            }}
          />
        ) : (
          <div className="emptyWikiButton" onClick={(e) => setIsEditing(true)}>
            <Typography variant="h6" fontWeight={"thin"}>
              {" "}
              + ADD WIKI{" "}
            </Typography>
          </div>
        )}
        <div className="canvasData">
          {nodeParents.length > 0 && (
            <div>
              <Typography variant="h7"> Parents </Typography>
              <Box sx={{ display: "flex", width: "auto" }}>
                {nodeParents.map((np) => (
                  <div
                    className="nodeCard"
                    onClick={() => {
                      setSelectedEL(np);
                    }}
                  >
                    {" "}
                    {np.data.label}{" "}
                  </div>
                ))}
              </Box>
            </div>
          )}
          {ogs.length > 0 && (
            <div>
              <Typography variant="h7">Outgoers</Typography>
              <Box sx={{ display: "flex", width: "auto" }}>
                {ogs.map((og) => (
                  <div
                    className="nodeCard"
                    onClick={() => {
                      setSelectedEL(rf.getNode(og.id));
                    }}
                  >
                    {" "}
                    {og.data.label}{" "}
                  </div>
                ))}
              </Box>
            </div>
          )}

          {incs.length > 0 && (
            <div>
              <Typography variant="h7">Incomers</Typography>
              <Box sx={{ display: "flex", width: "auto" }}>
                {incs.map((inc) => (
                  <div
                    className="nodeCard"
                    onClick={() => {
                      setSelectedEL(rf.getNode(inc.id));
                    }}
                  >
                    {" "}
                    {inc.data.label}{" "}
                  </div>
                ))}
              </Box>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
