import React from "react";

export default ({ width = 12, height = 12, ...props }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.99984 2.29102C14.2565 2.29102 17.7082 5.74185 17.7082 9.99935C17.7082 14.256 14.2565 17.7077 9.99984 17.7077C5.74234 17.7077 2.2915 14.256 2.2915 9.99935C2.2915 5.74185 5.74234 2.29102 9.99984 2.29102Z"
        stroke="#6D7F92"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99577 6.83594V10.5184"
        stroke="#6D7F92"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99551 13.1628H10.0038"
        stroke="#6D7F92"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
