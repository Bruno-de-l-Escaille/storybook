"use client";

import cn from "classnames";
import React, { memo } from "react";
import CloseIcon from "./assets/close.svg";

export default memo(({ onClose, theme, className }) => {
  const themeStyle = {
    backgroundColor: theme === "DARK" ? "#29394D" : "",
    borderColor: theme === "DARK" ? "#29394D" : "",
  };

  return (
    <div
      className={cn("rmodal__close", className)}
      style={themeStyle}
      onClick={onClose}
    >
      <CloseIcon />
    </div>
  );
});
