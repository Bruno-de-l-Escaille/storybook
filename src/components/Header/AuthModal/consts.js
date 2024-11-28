import React from "react";

export const SELECT_STYLES_LARGE = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#e6e6e6" : "#F8F9FA",
    boxShadow: "none",
    border: state.isFocused ? "1px solid #2495E1" : "1px solid #d1d5db",
    "&:hover": {
      borderColor: state.isFocused ? "#18A0FB" : "#d1d5db",
    },
    padding: 0,
    minHeight: "34px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "12px",
    lineHeight: "14px",
    color: "#6D7F92",
    fontWeight: 400,
    padding: "12px 8px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: "0",
    paddingBottom: "0",
  }),
  menu: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
    fontSize: "12px",
    lineHeight: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "#F1F2F4",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: ".75rem",
    textTransform: "uppercase",
    color: "inherit",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#29394D",
    padding: "11px 8px",
  }),
  indicatorSeparator: (provided) => ({ display: "none" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
};

export const IconCheckCircle = ({ size = 24 }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 448 448"
      fill="currentColor"
    >
      <title></title>
      <g id="icomoon-ignore"></g>
      <path d="M193.984 327.383c-6.427 0-12.506-3.007-16.414-8.164l-52.78-69.702c-6.865-9.065-5.078-21.974 3.988-28.841 9.080-6.872 21.98-5.073 28.847 3.987l34.713 45.837 87.308-140.183c6.010-9.644 18.702-12.595 28.369-6.593 9.653 6.008 12.601 18.71 6.586 28.363l-103.137 165.593c-3.582 5.757-9.768 9.379-16.541 9.685-0.315 0.012-0.626 0.017-0.939 0.017z"></path>
      <path d="M224 425.6c-111.341 0-201.6-90.26-201.6-201.6s90.259-201.6 201.6-201.6c111.34 0 201.6 90.259 201.6 201.6s-90.26 201.6-201.6 201.6zM224 448c123.712 0 224-100.288 224-224s-100.288-224-224-224c-123.712 0-224 100.288-224 224s100.288 224 224 224z"></path>
    </svg>
  );
};
