import { theme } from "../../Themes";
import styled from "styled-components";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";

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
  padding: 1% 5%;
  background-color: transparent;
  border-radius: 1vw;
  max-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

function SimulationsControls() {
  return (
    <SimulationsPlayerBar>
      <CircleDiv className="backward">
        <ArrowLeftRoundedIcon
          style={{
            width: "140%",
            height: "140%",
            fill: theme.palette.primary.lighterPink,
          }}
          fontSize="large"
          onClick={() => console.log("Simulations")}
        />
      </CircleDiv>

      <CircleDiv className="stop">
        <StopRoundedIcon
          style={{
            width: "70%",
            height: "70%",
            fill: theme.palette.primary.lighterPink,
          }}
          onClick={() => console.log("Simulations")}
        />
      </CircleDiv>
      <CircleDiv className="forward">
        <ArrowRightRoundedIcon
          style={{
            width: "140%",
            height: "140%",
            fill: theme.palette.primary.lighterPink,
          }}
          onClick={() => console.log("Simulations")}
        />
      </CircleDiv>
    </SimulationsPlayerBar>
  );
}

export default SimulationsControls;
