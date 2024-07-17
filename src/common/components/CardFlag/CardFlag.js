import classNames from "classnames";
import React from "react";
import styles from "./CardFlag.module.scss";
import { I18N } from "../../../i18n";

const getFlagProps = (flag) => {
  if (flag === "premium") {
    return { text: "includedPremium" };
  }

  return { text: "soldOut" };
};

function CardFlag({ className, language, flag }) {
  if (!flag) {
    return null;
  }

  const { text } = getFlagProps(flag);

  return (
    <span className={classNames(className, styles.flag, styles[flag], "sc")}>
      {I18N[language][text]}
    </span>
  );
}

export default CardFlag;
