import React from "react";

export default ({ width = 30, ...props }) => (
  <svg
    {...props}
    width={width}
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 52 52"
    enableBackground="new 0 0 0 0"
  >
    <circle fill="currentColor" stroke="none" cx="6" cy="25" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        begin="0.1"
      />
    </circle>
    <circle fill="currentColor" stroke="none" cx="26" cy="25" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        begin="0.2"
      />
    </circle>
    <circle fill="currentColor" stroke="none" cx="46" cy="25" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        begin="0.3"
      />
    </circle>
  </svg>
);
