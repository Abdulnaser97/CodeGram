import { Menu } from "@mui/material";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  Arrow,
  CircleShape,
  Cursor,
  DashedShape,
  Options,
  Rectangle,
  Text,
} from "../Media/ToolBar/ToolBarIcons";
import "./ToolBar.css";

const ToolBarBox = styled.div`
  position: fixed;
  top: 30vh;
  left: 1.5vw;
  width: 3vw;
  height: 17vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 7px;
  box-shadow: 0px 4px 10px rgba(5, 0, 56, 0.1);
  background-color: white;
  z-index: 1000;
`;

const ToolBarButtonStyle = styled.div`
  position: relative;
  height: 2.5vw;
  width: 36%;
  z-index: 1001;
  margin: 0.05vw 0.5vw 0.05vw 0.5vw;
  cursor: pointer;
`;

const ToolBarButton = styled(ToolBarButtonStyle)`
  ${({ active }) =>
    active &&
    `
    .Rect{   stroke: #ffaea6;}
    .options{ fill: #ffaea6;}
    .Text{   fill: #ffaea6;}
    path{   fill: #ffaea6;}
    .CircleShape{   stroke: #ffaea6;}
    .DashedShape{   stroke: #ffaea6;}

  `}
`;

const PopupButtonStyle = styled.div`
  position: relative;
  width: 1vw;
  z-index: 1001;
  cursor: pointer;
`;

const PopupButton = styled(PopupButtonStyle)`
  ${({ active }) =>
    active &&
    `
    .Rect{   stroke: #ffaea6;}
    .DashedShape{   stroke: #ffaea6;}
    .CircleShape{   stroke: #ffaea6;}

  `}
`;
function ToolBar(props) {
  const [active, setActive] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedShape, setSelectedShape] = useState(<Rectangle />);
  const selectedShapeName = useRef("rect");

  const moreShapes = (event) => {
    setAnchorEl(event.currentTarget);
    setActive("selectShape");
  };

  const shapeSelect = (shape, name) => {
    setAnchorEl(null);
    setSelectedShape(shape);
    selectedShapeName.current = name;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "shapes-popover" : undefined;

  return (
    <ToolBarBox>
      <ToolBarButton
        className="ToolBarButton"
        style={{ "margin-top": "1vw" }}
        active={active === "cursor" ? true : false}
        onClick={() => setActive("cursor")}
      >
        <Cursor />
      </ToolBarButton>
      <ToolBarButton
        className="ToolBarButton"
        active={active === "text" ? true : false}
        onClick={() => setActive("text")}
      >
        <Text />
      </ToolBarButton>
      <ToolBarButton
        className="ToolBarButton"
        active={active === "selectShape" ? true : false}
        onClick={(e) => moreShapes(e)}
      >
        {selectedShape}
      </ToolBarButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            position: "relative",
            width: "7vw",
            marginLeft: "1.3vw",
            marginTop: "-1vw",
            borderRadius: "7px",
            boxShadow: "0px 4px 10px rgba(5, 0, 56, 0.1)",
          },
        }}
        MenuListProps={{
          paddingtop: "2px",
          paddingbottom: "2px",
        }}
        transitionDuration={{ enter: 100, exit: 120 }}
      >
        <div className="ShapesGrid" key="ShapesGrid">
          <PopupButton
            className="PopupButton"
            key="PopupButton1"
            active={selectedShapeName.current === "rect" ? true : false}
            onClick={() => shapeSelect(<Rectangle />, "rect")}
          >
            <Rectangle />
          </PopupButton>
          <PopupButton
            className="PopupButton"
            key="PopupButton2"
            active={selectedShapeName.current === "DashedShape" ? true : false}
            onClick={() => shapeSelect(<DashedShape />, "DashedShape")}
          >
            <DashedShape />
          </PopupButton>
          <PopupButton
            className="PopupButton"
            key="PopupButton3"
            active={selectedShapeName.current === "CircleShape" ? true : false}
            onClick={() => shapeSelect(<CircleShape />, "CircleShape")}
          >
            <CircleShape />
          </PopupButton>
        </div>
      </Menu>
      <ToolBarButton
        className="ToolBarButton"
        active={active === "arrow" ? true : false}
        onClick={() => setActive("arrow")}
      >
        <Arrow />
      </ToolBarButton>
      <ToolBarButton
        className="ToolBarButton"
        active={active === "options" ? true : false}
        style={{ "margin-top": "0vw", "margin-bottom": "0.75vw" }}
        onClick={() => setActive("options")}
      >
        <Options />
      </ToolBarButton>
    </ToolBarBox>
  );
}

export default ToolBar;
