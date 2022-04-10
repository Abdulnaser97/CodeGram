import { Resizable } from "re-resizable";

import "./nodeStyles.css";
import { useState } from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { theme } from "../Themes";
import TextareaAutosize from "react-textarea-autosize";

const TextComponent = (props) => {
  const [height, setHeight] = useState(
    props.data.height ? props.data.height : Math.floor(150 / 15) * 15
  );
  const [width, setWidth] = useState(
    props.data.width ? props.data.width : Math.floor(350 / 15) * 15
  );
  const [fontSize, setFontSize] = useState(
    props.data.fontSize
      ? props.data.fontSize
      : `${Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2)) / 17}px`
  );

  const [refreshText, setRefreshText] = useState(false);
  const [borderRadius, setBorderRadius] = useState(
    `${Math.min(width, height) / 12}px`
  );
  const [selected, setSelected] = useState("selectedText");
  const [isEditing, setIsEditing] = useState(false);
  const [handleSize, setHandleSize] = useState(Math.sqrt(height + width));
  const [fitHeight, setFitHeight] = useState(false);

  useEffect(() => {
    if (props.selected) {
      if (props.data.type === "Text") setSelected("selectedText");
      if (props.data.requestEdit) {
        props.data.requestEdit = false;
      }
    } else {
      setSelected("");
    }
  }, [props.selected, props.data.type]);

  useEffect(() => {
    if (props.data.requestEdit) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [props.data.requestEdit]);

  useEffect(() => {
    props.data.height = height;
    props.data.width = width;
    props.data.fontSize = fontSize;
  }, [height, width, refreshText, fontSize]);

  function handleNewNodeName(event) {
    props.data.nodeInputHandler(event, "Text");
    setHeight(event.target.clientHeight + 30);
  }

  useEffect(() => {
    const innerText =
      document.getElementById(`label_${props.id}`) ||
      document.getElementById(`textarea_${props.id}`);

    if (innerText) {
      setHeight(innerText.clientHeight + 30);
    }

    if (fitHeight) {
      setFitHeight(false);
    }
  }, [fitHeight, isEditing, props.id, refreshText, props.selected]);

  return (
    <Resizable
      className={`${props.data.type} ${selected}`}
      size={{ width: width, height: height }}
      onResizeStart={(e, direction, ref, d) => {
        ref.className = `${props.data.type} nodrag ${selected}`;
      }}
      onResize={(e, direction, ref, d) => {
        setFontSize(`${Math.sqrt(Math.pow(height / 4 + d.height / 8, 2))}px`);

        setHandleSize(Math.sqrt(height + d.height + width + d.width));

        setBorderRadius(
          `${Math.min(width + d.width, height + d.height) / 12}px`
        );
      }}
      onResizeStop={(e, direction, ref, d) => {
        setHeight(height + d.height);
        setWidth(width + d.width);
        setFitHeight(true);
        ref.className = `${props.data.type} ${selected}`;
        setRefreshText(!refreshText);
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
          fontWeight="Medium"
          id={`label_${props.id}`}
          style={{
            "font-size": fontSize,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          textAlign="left"
          color="primary.darkestGrey"
        >
          {props.data.label && !isEditing ? (
            props.data.label
          ) : (
            <TextareaAutosize
              id={`textarea_${props.id}`}
              rows={5}
              maxRows={1000}
              onChange={handleNewNodeName}
              placeholder={`Enter Text`}
              autoFocus
              style={{
                width: `${width - 10}px`,
                border: "none",
                textAlign: "left",
                fontSize: fontSize,
                overflow: "hidden",
                resize: "none",
                outline: "none",
                background: "transparent",
                fontFamily: theme.typography.fontFamily,
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.palette.primary.darkestGrey,
              }}
            >
              {props.data.label}
            </TextareaAutosize>
          )}
        </Typography>
      }
    </Resizable>
  );
};

export { TextComponent };
