import cn from "classnames";
import React, { memo } from "react";
import { ReactComponent as ChevronRightDarkIcon } from "../assets/arrow-right-dark.svg";
import { ReactComponent as ChevronRightLightIcon } from "../assets/arrow-right-light.svg";
import styles from "./NextStep.module.scss";
import { I18N } from "../../../../i18n";

export default memo(
  ({
    disabled,
    className,
    theme = "",
    text,
    hideIcon,
    onClick,
    type = "submit",
    language = "fr",
  }) => {
    const translate = (text) => {
      return I18N[language][text];
    };
    const icon =
      theme === "greenJewel" ? (
        <ChevronRightDarkIcon />
      ) : (
        <ChevronRightLightIcon />
      );
    return (
      <button
        className={cn(className, styles.submit, styles[theme])}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        <span style={!hideIcon ? { marginRight: "10px" } : undefined}>
          {text ?? translate("continue")}
        </span>{" "}
        {!hideIcon && icon}
      </button>
    );
  }
);
