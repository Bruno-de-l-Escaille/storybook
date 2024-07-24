import classNames from "classnames";
import React from "react";
import styles from "./TimeCounter.module.scss";
import { I18N } from "../../../i18n";
import { useTimeCounter } from "../../hooks/useTimeCounter";

export default function TimeCounter({
  date,
  language,
  className,
  showDays = true,
}) {
  const timeCount = useTimeCounter(date);

  if (
    timeCount.days === "0" &&
    timeCount.hours === "0" &&
    timeCount.minutes === "0" &&
    timeCount.seconds === "0"
  ) {
    return null;
  }

  return (
    <div className={classNames(styles.time_counter, className)}>
      {!!showDays && (
        <>
          <div className={styles.counter_case}>
            {timeCount.days}
            <span>{I18N[language]["d"]}</span>
          </div>
          <span>:</span>
        </>
      )}
      <div className={styles.counter_case}>
        {timeCount.hours}
        <span>{I18N[language]["h"]}</span>
      </div>
      <span>:</span>
      <div className={styles.counter_case}>
        {timeCount.minutes}
        <span>{I18N[language]["m"]}</span>
      </div>
      <span>:</span>
      <div className={styles.counter_case}>
        {timeCount.seconds}
        <span>{I18N[language]["s"]}</span>
      </div>
    </div>
  );
}
