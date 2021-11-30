import styled from "styled-components";

const GitHubButtonCard = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const GitHub = () => {
  return (
    <GitHubButtonCard className="GitHubButtonCard">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 468 186"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="GitHubButton">
          <path
            id="GitButton"
            class="GitButton"
            d="M58 70.5H410C441.756 70.5 467.5 96.2436 467.5 128C467.5 159.756 441.756 185.5 410 185.5H58C26.2436 185.5 0.5 159.756 0.5 128C0.5 96.2436 26.2436 70.5 58 70.5Z"
            fill="white"
            stroke="#FFAEA6"
          />
          <path
            id="Login with GitHub"
            class="LoginWithGitHub"
            d="M106.4 135.04H113.12V139H101.27V117.94H106.4V135.04ZM123.187 139.24C121.547 139.24 120.067 138.89 118.747 138.19C117.447 137.49 116.417 136.49 115.657 135.19C114.917 133.89 114.547 132.37 114.547 130.63C114.547 128.91 114.927 127.4 115.687 126.1C116.447 124.78 117.487 123.77 118.807 123.07C120.127 122.37 121.607 122.02 123.247 122.02C124.887 122.02 126.367 122.37 127.687 123.07C129.007 123.77 130.047 124.78 130.807 126.1C131.567 127.4 131.947 128.91 131.947 130.63C131.947 132.35 131.557 133.87 130.777 135.19C130.017 136.49 128.967 137.49 127.627 138.19C126.307 138.89 124.827 139.24 123.187 139.24ZM123.187 134.8C124.167 134.8 124.997 134.44 125.677 133.72C126.377 133 126.727 131.97 126.727 130.63C126.727 129.29 126.387 128.26 125.707 127.54C125.047 126.82 124.227 126.46 123.247 126.46C122.247 126.46 121.417 126.82 120.757 127.54C120.097 128.24 119.767 129.27 119.767 130.63C119.767 131.97 120.087 133 120.727 133.72C121.387 134.44 122.207 134.8 123.187 134.8ZM141.029 122.02C142.209 122.02 143.239 122.26 144.119 122.74C145.019 123.22 145.709 123.85 146.189 124.63V122.26H151.319V138.97C151.319 140.51 151.009 141.9 150.389 143.14C149.789 144.4 148.859 145.4 147.599 146.14C146.359 146.88 144.809 147.25 142.949 147.25C140.469 147.25 138.459 146.66 136.919 145.48C135.379 144.32 134.499 142.74 134.279 140.74H139.349C139.509 141.38 139.889 141.88 140.489 142.24C141.089 142.62 141.829 142.81 142.709 142.81C143.769 142.81 144.609 142.5 145.229 141.88C145.869 141.28 146.189 140.31 146.189 138.97V136.6C145.689 137.38 144.999 138.02 144.119 138.52C143.239 139 142.209 139.24 141.029 139.24C139.649 139.24 138.399 138.89 137.279 138.19C136.159 137.47 135.269 136.46 134.609 135.16C133.969 133.84 133.649 132.32 133.649 130.6C133.649 128.88 133.969 127.37 134.609 126.07C135.269 124.77 136.159 123.77 137.279 123.07C138.399 122.37 139.649 122.02 141.029 122.02ZM146.189 130.63C146.189 129.35 145.829 128.34 145.109 127.6C144.409 126.86 143.549 126.49 142.529 126.49C141.509 126.49 140.639 126.86 139.919 127.6C139.219 128.32 138.869 129.32 138.869 130.6C138.869 131.88 139.219 132.9 139.919 133.66C140.639 134.4 141.509 134.77 142.529 134.77C143.549 134.77 144.409 134.4 145.109 133.66C145.829 132.92 146.189 131.91 146.189 130.63ZM157.61 120.52C156.71 120.52 155.97 120.26 155.39 119.74C154.83 119.2 154.55 118.54 154.55 117.76C154.55 116.96 154.83 116.3 155.39 115.78C155.97 115.24 156.71 114.97 157.61 114.97C158.49 114.97 159.21 115.24 159.77 115.78C160.35 116.3 160.64 116.96 160.64 117.76C160.64 118.54 160.35 119.2 159.77 119.74C159.21 120.26 158.49 120.52 157.61 120.52ZM160.16 122.26V139H155.03V122.26H160.16ZM174.078 122.08C176.038 122.08 177.598 122.72 178.758 124C179.938 125.26 180.528 127 180.528 129.22V139H175.428V129.91C175.428 128.79 175.138 127.92 174.558 127.3C173.978 126.68 173.198 126.37 172.218 126.37C171.238 126.37 170.458 126.68 169.878 127.3C169.298 127.92 169.008 128.79 169.008 129.91V139H163.878V122.26H169.008V124.48C169.528 123.74 170.228 123.16 171.108 122.74C171.988 122.3 172.978 122.08 174.078 122.08ZM214.48 122.26L209.95 139H204.28L201.64 128.14L198.91 139H193.27L188.71 122.26H193.84L196.21 134.23L199.03 122.26H204.46L207.31 134.17L209.65 122.26H214.48ZM219.016 120.52C218.116 120.52 217.376 120.26 216.796 119.74C216.236 119.2 215.956 118.54 215.956 117.76C215.956 116.96 216.236 116.3 216.796 115.78C217.376 115.24 218.116 114.97 219.016 114.97C219.896 114.97 220.616 115.24 221.176 115.78C221.756 116.3 222.046 116.96 222.046 117.76C222.046 118.54 221.756 119.2 221.176 119.74C220.616 120.26 219.896 120.52 219.016 120.52ZM221.566 122.26V139H216.436V122.26H221.566ZM234.614 134.65V139H232.004C230.144 139 228.694 138.55 227.654 137.65C226.614 136.73 226.094 135.24 226.094 133.18V126.52H224.054V122.26H226.094V118.18H231.224V122.26H234.584V126.52H231.224V133.24C231.224 133.74 231.344 134.1 231.584 134.32C231.824 134.54 232.224 134.65 232.784 134.65H234.614ZM247.761 122.08C249.681 122.08 251.221 122.72 252.381 124C253.541 125.26 254.121 127 254.121 129.22V139H249.021V129.91C249.021 128.79 248.731 127.92 248.151 127.3C247.571 126.68 246.791 126.37 245.811 126.37C244.831 126.37 244.051 126.68 243.471 127.3C242.891 127.92 242.601 128.79 242.601 129.91V139H237.471V116.8H242.601V124.51C243.121 123.77 243.831 123.18 244.731 122.74C245.631 122.3 246.641 122.08 247.761 122.08ZM278.024 124.6C277.644 123.9 277.094 123.37 276.374 123.01C275.674 122.63 274.844 122.44 273.884 122.44C272.224 122.44 270.894 122.99 269.894 124.09C268.894 125.17 268.394 126.62 268.394 128.44C268.394 130.38 268.914 131.9 269.954 133C271.014 134.08 272.464 134.62 274.304 134.62C275.564 134.62 276.624 134.3 277.484 133.66C278.364 133.02 279.004 132.1 279.404 130.9H272.894V127.12H284.054V131.89C283.674 133.17 283.024 134.36 282.104 135.46C281.204 136.56 280.054 137.45 278.654 138.13C277.254 138.81 275.674 139.15 273.914 139.15C271.834 139.15 269.974 138.7 268.334 137.8C266.714 136.88 265.444 135.61 264.524 133.99C263.624 132.37 263.174 130.52 263.174 128.44C263.174 126.36 263.624 124.51 264.524 122.89C265.444 121.25 266.714 119.98 268.334 119.08C269.954 118.16 271.804 117.7 273.884 117.7C276.404 117.7 278.524 118.31 280.244 119.53C281.984 120.75 283.134 122.44 283.694 124.6H278.024ZM289.475 120.52C288.575 120.52 287.835 120.26 287.255 119.74C286.695 119.2 286.415 118.54 286.415 117.76C286.415 116.96 286.695 116.3 287.255 115.78C287.835 115.24 288.575 114.97 289.475 114.97C290.355 114.97 291.075 115.24 291.635 115.78C292.215 116.3 292.505 116.96 292.505 117.76C292.505 118.54 292.215 119.2 291.635 119.74C291.075 120.26 290.355 120.52 289.475 120.52ZM292.025 122.26V139H286.895V122.26H292.025ZM305.073 134.65V139H302.463C300.603 139 299.153 138.55 298.113 137.65C297.073 136.73 296.553 135.24 296.553 133.18V126.52H294.513V122.26H296.553V118.18H301.683V122.26H305.043V126.52H301.683V133.24C301.683 133.74 301.803 134.1 302.043 134.32C302.283 134.54 302.683 134.65 303.243 134.65H305.073ZM326.17 117.94V139H321.04V130.33H313.06V139H307.93V117.94H313.06V126.19H321.04V117.94H326.17ZM346.404 122.26V139H341.274V136.72C340.754 137.46 340.044 138.06 339.144 138.52C338.264 138.96 337.284 139.18 336.204 139.18C334.924 139.18 333.794 138.9 332.814 138.34C331.834 137.76 331.074 136.93 330.534 135.85C329.994 134.77 329.724 133.5 329.724 132.04V122.26H334.824V131.35C334.824 132.47 335.114 133.34 335.694 133.96C336.274 134.58 337.054 134.89 338.034 134.89C339.034 134.89 339.824 134.58 340.404 133.96C340.984 133.34 341.274 132.47 341.274 131.35V122.26H346.404ZM355.219 124.63C355.699 123.85 356.389 123.22 357.289 122.74C358.189 122.26 359.219 122.02 360.379 122.02C361.759 122.02 363.009 122.37 364.129 123.07C365.249 123.77 366.129 124.77 366.769 126.07C367.429 127.37 367.759 128.88 367.759 130.6C367.759 132.32 367.429 133.84 366.769 135.16C366.129 136.46 365.249 137.47 364.129 138.19C363.009 138.89 361.759 139.24 360.379 139.24C359.199 139.24 358.169 139.01 357.289 138.55C356.409 138.07 355.719 137.44 355.219 136.66V139H350.089V116.8H355.219V124.63ZM362.539 130.6C362.539 129.32 362.179 128.32 361.459 127.6C360.759 126.86 359.889 126.49 358.849 126.49C357.829 126.49 356.959 126.86 356.239 127.6C355.539 128.34 355.189 129.35 355.189 130.63C355.189 131.91 355.539 132.92 356.239 133.66C356.959 134.4 357.829 134.77 358.849 134.77C359.869 134.77 360.739 134.4 361.459 133.66C362.179 132.9 362.539 131.88 362.539 130.6Z"
            fill="#FFAEA6"
          />
          <g id="GitHubLogo">
            <path
              id="GitButton_2"
              d="M61.5 104.5C32.7812 104.5 9.49999 81.2188 9.49999 52.5C9.49999 23.7812 32.7812 0.5 61.5 0.5C90.2188 0.5 113.5 23.7812 113.5 52.5C113.5 81.2188 90.2188 104.5 61.5 104.5Z"
              fill="white"
              stroke="#FFAEA6"
            />
            <path
              id="GitIcon"
              d="M60.3732 8.99998C35.7986 8.99998 17 28.0107 17 53.0514C17 73.0731 29.367 90.2062 47.0317 96.2362C49.2996 96.6514 50.0969 95.2252 50.0969 94.0517C50.0969 92.9323 50.0438 86.7579 50.0438 82.9666C50.0438 82.9666 37.6413 85.6747 35.0367 77.5866C35.0367 77.5866 33.0169 72.3329 30.1112 70.9789C30.1112 70.9789 26.0538 68.1444 30.3947 68.1986C30.3947 68.1986 34.8064 68.5596 37.2338 72.8565C41.114 79.8252 47.6164 77.8213 50.1501 76.6297C50.5576 73.7411 51.7092 71.7371 52.9849 70.5456C43.0806 69.4262 33.0878 67.9639 33.0878 50.5961C33.0878 45.6313 34.4343 43.1398 37.2692 39.9623C36.8085 38.7888 35.3025 33.9504 37.7299 27.7038C41.4329 26.5303 49.9552 32.5783 49.9552 32.5783C53.4987 31.5673 57.3081 31.0437 61.082 31.0437C64.8559 31.0437 68.6652 31.5673 72.2088 32.5783C72.2088 32.5783 80.731 26.5122 84.4341 27.7038C86.8614 33.9685 85.3554 38.7888 84.8947 39.9623C87.7296 43.1579 89.4659 45.6493 89.4659 50.5961C89.4659 68.018 79.0301 69.4082 69.1259 70.5456C70.7559 71.9718 72.1379 74.6799 72.1379 78.9226C72.1379 85.0067 72.0847 92.5352 72.0847 94.0156C72.0847 95.1891 72.8998 96.6153 75.1499 96.2001C92.8677 90.2062 104.88 73.0731 104.88 53.0514C104.88 28.0107 84.9479 8.99998 60.3732 8.99998Z"
              fill="#FFAEA6"
            />
          </g>
        </g>
      </svg>
    </GitHubButtonCard>
  );
};

export default GitHub;