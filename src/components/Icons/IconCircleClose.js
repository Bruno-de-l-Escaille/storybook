import React from "react";

export default ({ width = 26, height = 26, ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.0013 23.8333C18.9844 23.8333 23.8346 18.9831 23.8346 13C23.8346 7.01692 18.9844 2.16667 13.0013 2.16667C7.01822 2.16667 2.16797 7.01692 2.16797 13C2.16797 18.9831 7.01822 23.8333 13.0013 23.8333Z"
        stroke="#FF636E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.25 9.75L9.75 16.25"
        stroke="#FF636E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.75 9.75L16.25 16.25"
        stroke="#FF636E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
