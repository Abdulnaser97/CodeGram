import react, { useState, useEffect } from "react";

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
    renderFiles,
    selectedEL,
    setElements,
    setSelectedEL,
  } = props;

  const [wiki, setWiki] = useState(selectedEL ? selectedEL.data.wiki : "");
  const [newLabel, setNewLabel] = useState(
    selectedEL ? selectedEL.data.label : ""
  );
  useEffect(() => {
    if (selectedEL) {
      setWiki(selectedEL.data.wiki);
      setNewLabel(selectedEL.data.label);
    }
  }, [selectedEL]);

  const saveWikiToNode = () => {
    var selEl = null;
    setElements((els) =>
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
      setWiki(selectedEL.data.wiki);
      setNewLabel(selectedEL.data.label);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div
        className="navbar-button github"
        style={{ position: "fixed", right: "1.5vw" }}
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
        <a href={selectedEL && selectedEL.data.url}> source code link </a>
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
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: wiki,
            }}
          />
        )}
      </div>
    </Box>
  );
}
