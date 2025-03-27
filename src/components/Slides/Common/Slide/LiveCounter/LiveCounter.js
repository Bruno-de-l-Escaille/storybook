import React from "react";
import { I18N } from "../../../../../i18n";
import { getEventNbMinutes } from "../../../../../utils/event";
import styles from "./LiveCounter.module.scss";
import { useTimeCounter } from "../../../../../common/hooks/useTimeCounter";

export default function LiveCounter({
  startDateTime,
  endDateTime,
  isVirtual,
  language,
}) {
  const nbMinutes = getEventNbMinutes({ startDateTime, endDateTime });

  const timeCount = useTimeCounter(startDateTime);

  const showTimeCounter = nbMinutes <= 60;

  return (
    <div className={styles.live_now}>
      <div className={styles.label}>
        {isVirtual ? I18N[language]["liveNow"] : I18N[language]["inProgress"]}
      </div>
      {!!showTimeCounter && (
        <div className={styles.time}>
          {`${timeCount.minutes}:${timeCount.seconds}`} {I18N[language]["on"]}{" "}
          {nbMinutes} {I18N[language]["min"]}
        </div>
      )}
    </div>
  );
}
