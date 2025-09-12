import cn from "classnames";
import React from "react";
import { ReactComponent as CheckCircleIcon } from "../../assets/check-circle.svg";
import s from "./SummaryBlock.module.scss";

export function SummaryBlock({ title, children, empty = false, subTitle }) {
  const defaultTheme = "none";
  return (
    <section>
      <div
        className={cn(
          s.title,
          "flex-container align-middle",
          defaultTheme !== "none" ? s.passedStep : ""
        )}
      >
        <CheckCircleIcon />
        <div>{title}</div>
        <div className="m-l-s">{subTitle}</div>
      </div>
      <div>{children}</div>
    </section>
  );
}
