import cn from "classnames";
import React, { useEffect, useRef } from "react";
import s from "./steps-content.module.scss";

function StepsContent({ children, className, innerRef, theme = "blue" }) {
  const stepContentRef = useRef(null);

  useEffect(() => {
    if (stepContentRef.current) {
      const stepControl =
        stepContentRef.current.querySelector < HTMLDivElement > "#stepControl";
      if (stepControl) {
        const stepControlHeight = stepControl.offsetHeight;
        stepContentRef.current.style.height = `calc(100% - ${stepControlHeight}px)`;
      }
    }
  }, []);

  return (
    <div
      className={cn(s.steps_content, s[theme], className)}
      ref={stepContentRef}
    >
      {children}
    </div>
  );
}

export default StepsContent;
