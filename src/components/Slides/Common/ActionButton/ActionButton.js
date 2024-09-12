"use client";

import cn from "classnames";
import React from "react";
import styles from "./ActionButton.module.scss";

export default function ActionButton({
  name,
  link,
  theme = "default",
  className,
  onClick,
  id,
  type,
  pathname,
  ...props
}) {
  return (
    <div className={cn(styles.actionButton, className)}>
      <a
        href={onClick ? undefined : link}
        className={theme && styles[theme]}
        target={onClick ? undefined : "_blank"}
        rel={onClick ? undefined : "noopener noreferrer"}
        onClick={onClick ? () => onClick(id, type, pathname) : undefined}
        {...props}
      >
        {name}
      </a>
    </div>
  );
}
