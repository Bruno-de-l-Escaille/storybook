import classNames from "classnames";
import { buttonVariants } from "./services";
import React from "react";

export default function Button({
  name,
  value,
  type = "button",
  isDisabled = false,
  isLoading = false,
  icon,
  iconPosition = "left",
  children,
  className = "",
  size = "md",
  textSize = "md",
  uppercase = false,
  radius = "sm",
  shadow = "none",
  variant = "primary",
  isOutlined = false,
  isBlock = false,
  link = "",
  contentAlignment = "center",
  target = "",
  rel = "",
  onClick,
}) {
  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  const classes = classNames(
    buttonVariants({
      size,
      textSize,
      uppercase,
      radius,
      shadow,
      variant,
      isOutlined,
      isBlock,
      contentAlignment,
    }),
    className
  );
  if (link) {
    return (
      <a className={classes} href={link} rel={rel} target={target}>
        {content}
      </a>
    );
  }
  return (
    <button
      className={classes}
      disabled={isDisabled || isLoading}
      type={type}
      name={name}
      value={value}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
