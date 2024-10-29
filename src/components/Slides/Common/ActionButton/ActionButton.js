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
  isSmall = false,
  ...props
}) {
  return (
    <div
      className={cn(
        !isSmall ? styles.actionButton : styles.actionButton_small,
        className
      )}
    >
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
