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
  isOFFFcourse,
  ...props
}) {
  const onLinkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(id, type, pathname);
    } else if (!isOFFFcourse) {
      window.open(link, "_blank", "noreferrer");
    } else {
      window.location.href = link;
    }
  };

  return (
    <div
      className={cn(
        !isSmall ? styles.actionButton : styles.actionButton_small,
        className
      )}
    >
      <a
        href={link}
        onClick={onLinkClick}
        className={theme && styles[theme]}
        {...props}
      >
        {name}
      </a>
    </div>
  );
}
