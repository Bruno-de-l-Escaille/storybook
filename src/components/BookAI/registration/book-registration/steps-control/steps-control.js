import cn from "classnames";
import React from "react";
import s from "./steps-control.module.scss";

function StepsControlWrapper({ children, className }) {
  return (
    <div id="stepControl" className={cn(s.actions, className)}>
      {children}
    </div>
  );
}

export default StepsControlWrapper;
