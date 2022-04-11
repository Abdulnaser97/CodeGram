import React, { useState } from "react";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import apache from "react-syntax-highlighter/dist/esm/languages/hljs/apache";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import r from "react-syntax-highlighter/dist/esm/languages/hljs/r";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import htmlbars from "react-syntax-highlighter/dist/esm/languages/hljs/htmlbars";
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import {
  errorNotification,
  successNotification,
} from "../Redux/actions/notification";
import { useDispatch } from "react-redux";
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("apache", apache);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("r", r);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("htmlbars", htmlbars);

function getLangFromFilename(filename) {
  // Extract the extension from the filename
  const ext = filename.split(".").pop();
  // Return the language name
  switch (ext) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "kt":
      return "kotlin";
    case "r":
      return "r";
    case "php":
      return "php";
    case "c":
      return "c";
    case "h":
      return "c";
    case "go":
      return "go";
    case "swift":
      return "swift";
    case "cs":
      return "csharp";
    case "json":
      return "json";
    case "ts":
      return "typescript";
    case "css":
      return "css";
    case "cpp":
      return "cpp";
    case "html":
      return "htmlbars";
    default:
      return "plaintext";
  }
}

function CodeTab({ rawCode, fileName, fileNode, addLineNode }) {
  const lang = getLangFromFilename(fileName);
  const [selectedText, setSelectedText] = useState(null);
  const [popUpLoc, setPopUpLoc] = useState(null);
  console.log(lang);
  // If json, then stringify it
  if (lang === "json") {
    rawCode = JSON.stringify(rawCode, null, 2);
  }
  const dispatch = useDispatch();

  // function NewLineNodeButton() {
  //   return (
  //     <button
  //       style={{ position: "absolute" }}
  //       onClick={(event) => addLineNode({ event: event })}
  //     >
  //       ADD LINES
  //     </button>
  //   );
  // }

  const handleCodeMenuClose = (e) => {
    setSelectedText(null);
  };

  const handleCopyEvent = (e) => {
    try {
      var selectedText = "";
      if (window.getSelection) {
        var boundingClient = window.getSelection().toString();

        console.log(boundingClient);
        if (boundingClient.length > 0) {
          setSelectedText(boundingClient);
          setPopUpLoc({ x: e.clientX, y: e.clientY });
        }
      } else {
        setSelectedText(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedText);
  return (
    <div onMouseUp={(e) => handleCopyEvent(e)}>
      <Menu
        dense
        variant="menu"
        disableAutoFocus
        disableAutoFocusItem
        autoFocus={false}
        open={selectedText}
        onClose={handleCodeMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          popUpLoc && selectedText
            ? {
                top: popUpLoc.y,
                left: popUpLoc.x + 20,
              }
            : undefined
        }
        sx={{ boxShadow: 1 }}
      >
        <MenuItem
          dense
          fontSize="small"
          onClick={(event) => {
            console.log(fileNode);
            addLineNode({
              parentNode: fileNode,
              lines: selectedText,
            });
            setSelectedText(null);
          }}
        >
          <AddCircleOutlineOutlinedIcon />
        </MenuItem>
        <MenuItem
          fontSize="small"
          dense
          onClick={() => {
            navigator.clipboard.writeText(selectedText);
            setSelectedText(null);
            dispatch(
              successNotification(
                `Copied text from ${
                  fileName ? fileName : "no-name Node"
                } to clipboard!`
              )
            );
          }}
        >
          <ContentCopyOutlinedIcon />
        </MenuItem>
      </Menu>
      <SyntaxHighlighter
        language={lang}
        style={{ ...xcode, backgroundColor: "#fbfbfb" }}
        showLineNumbers={true}
        // showInLineNumbers={true}
        lineNumberStyle={{
          "-webkit-user-select": "none" /* Safari */,
          "-moz-user-select": "none" /* Firefox */,
          "-ms-user-select": "none" /* IE10+/Edge */,
          "user-select": "none" /* Standard */,
          // color: "grey",
          opacity: "30%",
        }}
        lineNumberContainerStyle={{
          padding: 0,
          color: "orange",
          "-webkit-user-select": "none " /* Safari */,
          "-moz-user-select": "none" /* Firefox */,
          "-ms-user-select": "none" /* IE10+/Edge */,
          "user-select": "none" /* Standard */,
        }}
        // lineProps={{
        //   style: { wordBreak: "break-word", whiteSpace: "pre-wrap" },
        // }}
        // wrapLines={true}
      >
        {rawCode}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeTab;
