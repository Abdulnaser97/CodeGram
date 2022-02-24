import styled from "styled-components";

const ButtonWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const Cursor = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="90%"
        height="90%"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Cursor">
          <path
            className="circle"
            fillRule="evenodd"
            clip-rule="evenodd"
            d="M11.1852 6.7701L0.384756 0.0832963L1.41666 12.4241L5.01666 9.3384L7.58512 13.4563L9.12801 12.4241L6.55653 8.31333L11.1852 6.7701Z"
            fill="#353535"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const TextIcon = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="TextIcon">
          <rect
            className="TextIcon"
            x="0.841797"
            y="0.0839844"
            width="14.4002"
            height="2.05717"
            rx="0.5"
            fill="#353535"
          />
          <rect
            className="TextIcon"
            x="7.01318"
            y="16.5415"
            width="15.4288"
            height="2.05717"
            rx="0.5"
            transform="rotate(-90 7.01318 16.5415)"
            fill="#353535"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const Rectangle = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Rectangle">
          <rect
            className="Rect"
            x="1"
            y="1"
            width="15"
            height="15"
            rx="2"
            stroke="#353535"
            strokeWidth="2"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const DashedShape = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="DashedShape">
          <rect
            className="DashedShape"
            x="1"
            y="1"
            width="15"
            height="15"
            rx="2"
            stroke="#353535"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeDasharray="6 1"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const ShadowBoxShape = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 17 17"
        fill="#353535"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="ShadowBoxShape">
          git
          <rect
            className="ShadowBoxShape"
            x="1"
            y="1"
            width="15"
            height="15"
            rx="2"
            stroke="#353535"
            strokeWidth="1"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const CircleShape = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Options">
          <circle
            className="CircleShape"
            cx="9"
            cy="9"
            r="8"
            stroke="#353535"
            strokeWidth="2"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const Cylinder = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Cylinder">
          <rect id="Rectangle 86" y="66" width="290" height="232" fill="none" />
          <ellipse
            id="Ellipse 20"
            cx="145"
            cy="65.5"
            rx="145"
            ry="65.5"
            fill="none"
          />
          <ellipse
            id="Ellipse 21"
            cx="145"
            cy="297.5"
            rx="145"
            ry="65.5"
            fill="none"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const Arrow = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Arrow">
          <path
            d="M13.242 0.0566321L4.78735 1.9326L10.6393 8.31654L13.242 0.0566321ZM1.40572 11.924L8.77298 5.17064L7.75939 4.06491L0.392132 10.8182L1.40572 11.924Z"
            fill="black"
          />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const Options = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 10 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Options">
          <circle className="options" cx="9" cy="1" r="1" fill="#353535" />
          <circle className="options" cx="5" cy="1" r="1" fill="#353535" />
          <circle className="options" cx="1" cy="1" r="1" fill="#353535" />
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const Undo = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 23 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="Undo"
          d="M5 14.5C8.5 8 17.5 8 20 15M9.018 15H4l.018-5"
          fill="none"
          fill-rule="evenodd"
          stroke="black"
          stroke-linecap="round"
          stroke-width="2.3"
        ></path>
      </svg>
    </ButtonWrapper>
  );
};

export const Redo = () => {
  return (
    <ButtonWrapper className="buttonWrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 23 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="Redo"
          d="M19 14.5C15.5 8 6.5 8 4 15m10.982 0H20l-.018-5"
          fill="none"
          fill-rule="evenodd"
          stroke="black"
          stroke-linecap="round"
          stroke-width="2.3"
        ></path>
      </svg>
    </ButtonWrapper>
  );
};
