import React from "react";

export default function IconX({
  width = 12,
  height = 12,
  stroke = "#FC5D2B",
  strokeWidth = 1.5,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M9 3L3 9M3 3L9 9"
        stroke={stroke}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
