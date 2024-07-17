import cn from "classnames";
import React from "react";
import s from "./ProgressBar.module.scss";

export function ProgressBar({
  progress,
  style,
  className,
  width = "190px",
  height = "6px",
  color = "#06d9b1",
  renderInfos,
  showProgressNumber = true,
  isEventWatch,
}) {
  const progresssion = progress < 0 || progress > 100 ? 0 : progress;

  return (
    <div
      className={cn(s.progressWrapper, className)}
      style={{ ...style, width, height }}
    >
      <div
        className={isEventWatch ? s.watchProgressBar : s.progressBar}
        style={{ width: `${progresssion}%`, color, background: color, height }}
      />
      {showProgressNumber && (
        <div className={s.label} style={{ left: `${progresssion}%`, color }}>
          {`${progress}%`}
        </div>
      )}
      {renderInfos && (
        <div className={s.infos} style={{ left: `${progresssion}%` }}>
          {renderInfos()}
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
