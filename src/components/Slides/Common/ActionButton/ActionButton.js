"use client";

import cn from "classnames";
import React from "react";
import styles from "./ActionButton.module.scss";

export default function ActionButton({
  name,
  link,
  theme = "default",
  className,
  ...props
}) {
  return (
    <div className={cn(styles.actionButton, className)}>
      <a
        href={link ?? "#"}
        className={theme && styles[theme]}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {name}
      </a>
    </div>
  );
}
