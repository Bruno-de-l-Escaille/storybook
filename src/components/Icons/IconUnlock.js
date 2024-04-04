import React from "react";

export default ({ width = 12, height = 12, fill = "#6D7F92", ...props }) => {
  return (
    <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 5.5H2.5C1.94772 5.5 1.5 5.94772 1.5 6.5V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V6.5C10.5 5.94772 10.0523 5.5 9.5 5.5Z"
      stroke={fill}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.5 5.50057V3.50057C3.49938 2.88059 3.72914 2.2825 4.14469 1.8224C4.56023 1.3623 5.13192 1.07302 5.74875 1.01071C6.36559 0.948403 6.98357 1.11752 7.48274 1.48522C7.9819 1.85293 8.32663 2.39299 8.45 3.00057"
      stroke={fill}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  );
};
