import React from "react";

export default function CheckMark({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.2559 4.41009C17.5814 4.73553 17.5814 5.26317 17.2559 5.5886L8.08926 14.7553C7.76382 15.0807 7.23618 15.0807 6.91074 14.7553L2.74408 10.5886C2.41864 10.2632 2.41864 9.73553 2.74408 9.41009C3.06951 9.08466 3.59715 9.08466 3.92259 9.41009L7.5 12.9875L16.0774 4.41009C16.4028 4.08466 16.9305 4.08466 17.2559 4.41009Z"
        fill="#02AF8E"
      />
    </svg>
  );
}
