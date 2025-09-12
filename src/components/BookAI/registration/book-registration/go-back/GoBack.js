import cn from "classnames";
import React, { memo } from "react";
import ChevronLeftIcon from "../assets/chevron-left-gray.svg";
import styles from "./GoBack.module.scss";
import { I18N } from "../../../../../i18n";

export default memo(
  ({ disabled, className, hideIcon, text, theme = "", onClick, language }) => {
    const translate = (text) => {
      return I18N[language][text];
    };
    const handleClick = (e) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    };
    return (
      <button
        className={cn(className, styles.goBack)}
        onClick={handleClick}
        disabled={disabled}
      >
        {!hideIcon && <ChevronLeftIcon width="18" height="15" />}
        <span className={cn(!hideIcon && "m-l-xs")}>
          {text ?? translate("back")}
        </span>
      </button>
    );
  }
);
