import { theme } from "../../Themes";
import styled from "styled-components";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
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

function SimulationsControls({ isRunning, setIsRunning, prev, setPrev, current, setCurrent }) {
    const [disableBackWard, setDisableBackWard] = useState(true);
    const [disableForward, setDisableForward] = useState(false);
    const handleForward = () => {
        if (current) {
            const newIdx = current+1
            if (newIdx >= simFiles.length) {
                setDisableForward(true);
                return;
            }
            setPrev(current);
            setCurrent(newIdx);
            setDisableBackWard(false);
        }
    }
    const handleBackward = () => {
        if (current) {
            const newIdx = current-1
            if (newIdx <= 0) {
                setDisableBackWard(true);
                return;
            }
            setPrev(current);
            setCurrent(newIdx);
            setDisableForward(false);
        }
  return (
    <SimulationsPlayerBar>
      <CircleDiv className="backward">
        <NavigateBeforeRoundedIcon
          style={{
            width: "100%",
            height: "100%",
            fill: theme.palette.primary.lighterPink,
          }}
          fontSize="large"
          onClick={() => handleBackward()}
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
            onClick={() => setIsRunning(false)}
          />
        ) : (
          <ArrowRightRoundedIcon
            style={{
              width: "140%",
              height: "140%",
              fill: theme.palette.primary.lighterPink,
            }}
            fontSize="large"
            onClick={() => handleForward()}
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
          onClick={() => console.log("Simulations")}
        />
      </CircleDiv>
    </SimulationsPlayerBar>
  );
}

export default SimulationsControls;
