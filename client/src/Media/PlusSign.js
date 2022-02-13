import styled from "styled-components";

const PlusSignCard = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const PlusSign = () => {
  return (
    <PlusSignCard className="PlusSignCard">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_250_84)">
          <circle cx="7" cy="6" r="6" fill="#FDFDFD" />
        </g>
        <rect
          x="6.71387"
          y="4"
          width="0.571429"
          height="4"
          rx="0.285714"
          fill="#FFC0A5"
        />
        <rect
          x="5"
          y="6.28564"
          width="0.571429"
          height="4"
          rx="0.285714"
          transform="rotate(-90 5 6.28564)"
          fill="#FFC0A5"
        />
        <defs>
          <filter
            id="filter0_d_250_84"
            x="0"
            y="0"
            width="14"
            height="14"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="0.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_250_84"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_250_84"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </PlusSignCard>
  );
};

export default PlusSign;
