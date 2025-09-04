import React from "react";
import { components, Props as ReactSelectProps } from "react-select";
import PolygonIcon from "../assets/polygon.svg";
import styles from "./TTPSelect.module.scss";

export const findSelectedValue = (value, options) => {
  if (!options || !value || value === "" || value.length === 0) {
    return null;
  }

  if (Array.isArray(value)) {
    const selectedOptions = [];
    for (const v of value) {
      const selectedValue = findSelectedValue(v, options);
      if (selectedValue) {
        selectedOptions.push(selectedValue);
      }
    }

    return selectedOptions;
  }

  for (const op of options) {
    const option = op;

    if (!option.options && option.value && option.value === value) {
      return option;
    }

    if (option?.options && Array.isArray(option?.options)) {
      const find = findSelectedValue(value, option.options);
      if (find) {
        return find;
      }
    }
  }

  return null;
};

/*
 * React select styles
 */

const textStyle = () => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "14px",
  textTransform: "uppercase",
});

export const getSelectStyles = (
  theme,
  customTextStyle,
  customInputStyle,
  hasError,
  selected
) => {
  // const layoutTheme = getTheme(theme);
  // const themeColor = layoutTheme.primaryColor;

  return {
    control: (styles, { isFocused, hasValue }) => ({
      ...styles,
      minHeight: "34px",
      cursor: "pointer",
      backgroundColor: "#f1f2f4",
      borderRadius: "12px",
      boxShadow: "none",
      border: `0.5px solid ${
        hasError
          ? "#fe3745"
          : (hasValue || isFocused || selected) && selected !== false
      }`,
      ...textStyle(),
      ...customTextStyle,
      ":hover": {
        ...styles?.[":hover"],
        // borderColor: themeColor,
      },
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: "2px 0px 2px 4px",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#29394D",
    }),
    clearIndicator: (styles) => ({
      ...styles,
      padding: 6.5,
      color: "#29394D",
      ":hover": {
        color: "#29394D",
      },
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "#B2BCC6",
      ":hover": {
        backgroundColor: "#B2BCC6",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      padding: 6.5,
      transform: state.selectProps.menuIsOpen && "rotate(180deg)",
      transition: "transform .3s ease-in-out",
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 200,
      backgroundColor: "#FFFFFF",
      border: "1px solid #C7E8FE",
      boxShadow: "0px 2px 8px rgba(41, 57, 77, 0.3)",
      borderRadius: "4px",
    }),
    option: (styles, { isDisabled, isSelected, isFocused }) => ({
      ...styles,
      ...textStyle(),
      ...customTextStyle,
      cursor: "pointer",
      color: isDisabled ? undefined : "#29394D",
      backgroundColor: isDisabled
        ? undefined
        : isSelected || isFocused
        ? "#F1F2F4"
        : "#FFFFFF",
      ":hover": {
        ...styles?.[":hover"],
        backgroundColor: isDisabled ? undefined : "#F1F2F4",
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "#6D7F92",
    }),
    input: (styles) => ({
      ...styles,
      caretColor: "#FFF",
      ...textStyle(),
      ...customTextStyle,
      color: "#FFF",
      ...customInputStyle,
    }),
    noOptionsMessage: (styles) => ({
      ...styles,
      ...textStyle(),
      ...customTextStyle,
    }),
    loadingMessage: (styles) => ({
      ...styles,
      ...textStyle(),
      ...customTextStyle,
    }),
  };
};

export const getAsyncSelectStyles = (
  theme,
  customTextStyle,
  customInputStyle
) => {
  const { input, ...selectStyles } = getSelectStyles(
    theme,
    customTextStyle,
    customInputStyle
  );

  return {
    ...selectStyles,
    dropdownIndicator: () => ({ display: "none" }),
    indicatorSeparator: () => ({ display: "none" }),
    input: () => ({
      ...input,
      caretColor: "#29394D",
      color: "#29394D",
    }),
  };
};

/*
 * React Select components
 */

export function Menu(props) {
  const { title } = props?.selectProps ?? {};

  return (
    <components.Menu {...props}>
      {title && <div className={styles.menuHeader}>{title}</div>}
      {props?.children}
    </components.Menu>
  );
}

export function DropdownIndicator(props: any) {
  return (
    <components.DropdownIndicator {...props}>
      <PolygonIcon fill="#6D7F92" width="11" height="7" />
    </components.DropdownIndicator>
  );
}

export function NoOptionsMessage(props) {
  return (
    <components.NoOptionsMessage {...props}>
      <span className="custom-css-class">Nothing Found</span>
    </components.NoOptionsMessage>
  );
}

export function LoadingMessage(props) {
  return (
    <components.LoadingMessage {...props}>
      <span className="custom-css-class">Loading ...</span>
    </components.LoadingMessage>
  );
}
