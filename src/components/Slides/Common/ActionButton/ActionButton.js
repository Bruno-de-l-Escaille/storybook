"use client";

import cn from "classnames";
import React from "react";
import styles from "./ActionButton.module.scss";

export default function ActionButton({
  name,
  link,
  theme = "default",
  className,
  isSmall = false,
  isPremium,
  Link = "a",
  handleRegistration,
  isLightRegistration,
  ...props
}) {
  const handleClick = (e) => {
    if (isLightRegistration && handleRegistration) {
      e.preventDefault();
      handleRegistration();
    }
  };

  return (
    <div
      className={cn(
        !isSmall ? styles.actionButton : styles.actionButton_small,
        className
      )}
    >
      <Link
        href={link}
        className={theme && styles[theme]}
        target={isPremium ? "_blank" : "_self"}
        rel={isPremium ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        {...props}
      >
        {name}
      </Link>
    </div>
  );
}
