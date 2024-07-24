import classNames from "classnames";
import React from "react";
import styles from "./RegisteredBadge.module.scss";
import CheckMarkIcon from "../../../components/Icons/CheckMarkv2";

export function RegisteredBadge({ className, theme = "green" }) {
  const fillIcon = theme === "green" ? "#FFFF" : "#02AF8E";

  return (
    <span className={classNames(className, styles.registred, styles[theme])}>
      <div className="text-center m-t-xxs m-l-xs">
        <CheckMarkIcon width="12" height="12" />
      </div>
    </span>
  );
}

export default RegisteredBadge;
