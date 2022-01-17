import react, { useState, useEffect } from "react";

import { Box, Typography } from "@mui/material";

import TextEditor from "../components/TextEditor.js";
import { theme } from "../Themes";
import { useStoreActions } from "react-flow-renderer";


// TODO: needs extra click and click away to set the selectedEL to 
// the properly updated one. Tried to resolve using setSelectedElements 
// on saveWikiToNode

export default function DocsTab(props) {
  const { isEditing, setIsEditing, renderFiles, selectedEL, setElements, setSelectedEL } =
    props;

  const [wiki, setWiki] = useState(selectedEL.data.wiki);
  const [newLabel, setNewLabel] = useState(selectedEL.data.label);

  useEffect(() => {
    setWiki(selectedEL.data.wiki)
    setNewLabel(selectedEL.data.label)
  }, [selectedEL])  

  const saveWikiToNode = () => {
    var selEl = null
    setElements((els) =>
      els.map((el) => {
        if (el.id === selectedEL.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el.data = {
            ...el.data,
            label: newLabel.toString(),
            wiki: wiki,
          };
        }
        selEl = el 
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
    if (isEditing){
      setWiki(selectedEL.data.wiki)
      setNewLabel(selectedEL.data.label)
    }
    setIsEditing(!isEditing)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div
        className="navbar-button github"
        style={{ position: "fixed", right: "1.5vw" }}
        onClick={() => handleDoneOrEditClick()}
      >
        <Box className="EditWikiButtonWrapper">
          <Typography mx={1} my={0.8} fontSize=".8vw" fontWeight="Thin">
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
            <Typography mx={1} my={0.8} fontSize=".8vw" fontWeight="Thin">
              Save
            </Typography>
          </Box>
        </div>
      )}
      {selectedEL.data.label ? (
        <Typography variant="h5" fontWeight="bold">
          {selectedEL.data.label}
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
        <a href={selectedEL.data.url}> source code link </a>
      </Typography>
      <Typography my={1} variant="h6">
        Wiki
      </Typography>
      {isEditing ? (
        <TextEditor
          content={selectedEL.data.wiki ? selectedEL.data.wiki : ''}
          onChange={handleWikiChange}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: wiki
          }}
        />
      )}
      {/* <Typography variant="h7" mt={2}>
        Parent Nodes <br />
        <Typography> {selectedEL.data.parentNodes} </Typography>
      </Typography>
      <Typography variant="h7" mt={2}>
        Child Nodes <br />
        <Typography> {selectedEL.data.childNodes} </Typography>
      </Typography>
      <Typography variant="h7" mt={2}>
        Configuration Files <br />
        <Typography> {selectedEL.data.parentNodes} </Typography>
      </Typography>
      <Typography variant="h7" mt={2}>
        Reference Docs <br />
        {renderFiles()}
        <Typography> {selectedEL.data.documentation}</Typography>
      </Typography> */}
    </Box>
  );
}
