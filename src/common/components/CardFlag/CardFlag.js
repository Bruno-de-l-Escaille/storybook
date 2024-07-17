import classNames from "classnames";
import React from "react";
import { I18N } from "../../i18n";
import styles from "./CardFlag.module.scss";

const getFlagProps = (flag) => {
  if (flag === "premium") {
    return { text: "Included premium" };
  }

  return { text: "Sold Out" };
};

function CardFlag({ className, language, flag }) {
  if (!flag) {
    return null;
  }

  const { text } = getFlagProps(flag);

  return (
    <span className={classNames(className, styles.flag, styles[flag], "sc")}>
      {I18N[language](text)}
    </span>
  );
}

export default CardFlag;
