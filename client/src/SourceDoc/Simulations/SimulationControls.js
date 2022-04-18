import { theme } from "../../Themes";
import styled from "styled-components";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { useState } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const CircleDiv = styled.div`
  position: relative;
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  background-color: #fdfdfd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  box-shadow: #ffaea6 0px 0px 0px 1px;
  &:hover {
    background-color: ${theme.palette.primary.lighterPink};
    box-shadow: rgb(0 0 0 / 15%) 0px 2px 3px 1px;
  }
  &: hover path {
    fill: white;
  }
`;
const SimulationsPlayerBar = styled.div`
  position: relative;
  width: 7.5vw;
  height: 2.1vw;
  margin-bottom: 2%;
  padding: 5% 5%;
  background-color: transparent;
  border-radius: 1vw;
  max-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Controls = styled.div`
  position: relative;
  width: 100%;
  height: 2.2vw;
  background-color: transparent;
  border-radius: 1vw;
  max-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
`;

const ButtonsWrapper = styled.div`
  position: relative;
  width: 20%;
  height: 2.2vw;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  right: 8%;
`;

function SimulationsControls({
  isRunning,
  setIsRunning,
  prev,
  setPrev,
  current,
  setCurrent,
  simFiles,
  setSelectedEL,
  createCustomChange,
  isEditing,
  setIsEditing,
  setIsMaxSD,
}) {
  const [disableBackWard, setDisableBackWard] = useState(true);
  const [disableForward, setDisableForward] = useState(false);
  const handleForward = () => {
    if (current !== undefined) {
      const newIdx = current + 1;
      if (newIdx >= simFiles?.length) {
        setDisableForward(true);
        return;
      }
      setPrev(current);
      createCustomChange("deselectAll");
      setCurrent(newIdx);
      setDisableBackWard(false);
    }
  };
  const handleBackward = () => {
    if (current !== undefined) {
      const newIdx = current - 1;
      if (newIdx < 0) {
        setDisableBackWard(true);
        return;
      }
      setPrev(current);
      createCustomChange("deselectAll");
      setCurrent(newIdx);
      setDisableForward(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setPrev(current);
    createCustomChange("deselectAll");
    setDisableForward(true);
    setDisableBackWard(true);
  };
  const handleStart = () => {
    setIsRunning(true);
    createCustomChange("deselectAll");
    setDisableForward(false);
    setDisableBackWard(false);
    setIsMaxSD(true);
  };
  return (
    <Controls>
      <SimulationsPlayerBar>
        <CircleDiv className="backward">
          <NavigateBeforeRoundedIcon
            style={{
              width: "100%",
              height: "100%",
              fill: theme.palette.primary.lighterPink,
            }}
            fontSize="large"
            onClick={handleBackward}
          />
        </CircleDiv>

        <CircleDiv className="stop">
          {isRunning ? (
            <StopRoundedIcon
              style={{
                width: "70%",
                height: "70%",
                fill: theme.palette.primary.lighterPink,
              }}
              onClick={handleStop}
            />
          ) : (
            <ArrowRightRoundedIcon
              style={{
                width: "140%",
                height: "140%",
                fill: theme.palette.primary.lighterPink,
              }}
              fontSize="large"
              onClick={handleStart}
            />
          )}
        </CircleDiv>
        <CircleDiv className="forward">
          <NavigateNextRoundedIcon
            style={{
              width: "100%",
              height: "100%",
              fill: theme.palette.primary.lighterPink,
            }}
            onClick={handleForward}
          />
        </CircleDiv>
      </SimulationsPlayerBar>
      <ButtonsWrapper>
        <div
          className="navbar-button github"
          style={{ position: "relative", "overflow-y": "auto" }}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Box className="EditWikiButtonWrapper">
            <Typography
              mx={1}
              my={0.8}
              fontSize=".8vw"
              fontWeight="Regular"
              color="primary"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Typography>
          </Box>
        </div>
        {isEditing && (
          <div
            className="navbar-button github"
            onClick={() => {
              console.log("To implement save functionality");
              setIsEditing(!isEditing);
            }}
          >
            <Box className="EditWikiButtonWrapper" mx={1}>
              <Typography
                mx={1}
                my={0.8}
                fontSize=".8vw"
                fontWeight="Regular"
                color="primary"
              >
                Save
              </Typography>
            </Box>
          </div>
        )}
      </ButtonsWrapper>
    </Controls>
  );
}

export default SimulationsControls;
