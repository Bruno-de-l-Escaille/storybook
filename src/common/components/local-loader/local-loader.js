"use client";

import cn from "classnames";
import React, { memo } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./local-loader.module.scss";
import { getTheme } from "./services";

export function LocalLoaderWrapper({ children, className, style, theme = "" }) {
  return (
    <div className={cn(styles.wrapper, className, styles[theme])} style={style}>
      {children}
    </div>
  );
}

export default memo(({ loading, className, style, counter, theme }) => {
  const layoutTheme = theme;

  return loading ? (
    <div className={cn(styles.loading, className)} style={style}>
      <ClipLoader size={35} color={getTheme(layoutTheme).primaryColor} />
      {counter !== undefined ? (
        <div className={styles.counter}>{counter} %</div>
      ) : null}
    </div>
  ) : null;
});
