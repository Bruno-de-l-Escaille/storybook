import moment from "moment";
import { useEffect, useState } from "react";

const initialTimeCount = {
  days: "0",
  hours: "0",
  minutes: "0",
  seconds: "0",
};

export const useTimeCounter = (date) => {
  const [timeCount, setTimeCount] = useState(initialTimeCount);

  useEffect(() => {
    const timerId = setInterval(() => {
      const editedDateTime = moment(date);
      const now = moment();

      const daysCount = editedDateTime.diff(now, "days");
      const hoursCount = editedDateTime
        .subtract(daysCount, "days")
        .diff(now, "hours");
      const minutesCount = editedDateTime
        .subtract(hoursCount, "hours")
        .diff(now, "minutes");
      const secondsCount = editedDateTime
        .subtract(minutesCount, "minutes")
        .diff(now, "seconds");

      setTimeCount({
        days: String(Math.abs(daysCount)).padStart(2, "0"),
        hours: String(Math.abs(hoursCount)).padStart(2, "0"),
        minutes: String(Math.abs(minutesCount)).padStart(2, "0"),
        seconds: String(Math.abs(secondsCount)).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [date]);

  return timeCount;
};
