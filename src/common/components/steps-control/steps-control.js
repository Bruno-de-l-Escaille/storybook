import cn from "classnames";
import React from "react";
import s from "./steps-control.module.scss";
// import { useTheme } from "@/contexts/theme/use-theme";

// interface Props {
//   children: React.ReactNode;
//   className?: string;
// }

function StepsControlWrapper({ children, className }) {
  // const { theme } = useTheme();
  return (
    <div id="stepControl" className={cn(s.actions, className)}>
      {children}
    </div>
  );
}

export default StepsControlWrapper;
