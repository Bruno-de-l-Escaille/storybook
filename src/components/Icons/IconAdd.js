import React from "react";

export default ({ width = 12, height = 12, ...props }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <g clip-path="url(#clip0_54221_63147)">
        <path d="M6 0.75V11.25" stroke="#18A0FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.75 6H11.25" stroke="#18A0FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_54221_63147">
          <rect width={width} height={height} fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};
