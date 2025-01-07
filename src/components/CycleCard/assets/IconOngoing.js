import React from "react";

export default function IconOngoing(props) {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_7814_91360)">
        <rect
          x="1"
          y="1.67969"
          width="14"
          height="14"
          rx="7"
          fill="url(#paint0_radial_7814_91360)"
        />
        <g filter="url(#filter0_d_7814_91360)">
          <rect
            x="3.42969"
            y="4.10938"
            width="9.14286"
            height="9.14286"
            rx="4.57143"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_7814_91360"
          x="-6.57031"
          y="-1.89062"
          width="29.1445"
          height="29.1445"
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
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.160784 0 0 0 0 0.223529 0 0 0 0 0.301961 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_7814_91360"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_7814_91360"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_7814_91360"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(8 8.67969) rotate(90) scale(7)"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color="white" stop-opacity="0.5" />
        </radialGradient>
        <clipPath id="clip0_7814_91360">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.679688)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
