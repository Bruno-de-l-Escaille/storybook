import React, { useState, useRef, useEffect } from "react";
import styles from "./TimePicker.module.scss";
import IconClock from "../../../Icons/IconClock";

export const TimePicker = ({ value, onChange, placeholder, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Parse existing value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":");
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    const minute = selectedMinute || "00";
    onChange({ target: { value: `${hour}:${minute}` } });
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
    const hour = selectedHour || "00";
    onChange({ target: { value: `${hour}:${minute}` } });
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const displayValue = value || "";

  return (
    <div className={styles.timePicker}>
      <div className={styles.timePicker_inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          className={`${styles.timePicker_input} ${
            hasError ? styles.timePicker_input_error : ""
          }`}
        />
        <div className={styles.timePicker_separator}></div>
        <IconClock />
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={styles.timePicker_dropdown}>
          <div className={styles.timePicker_column}>
            <div className={styles.timePicker_columnHeader}>Hour</div>
            <div className={styles.timePicker_scrollContainer}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={`${styles.timePicker_option} ${
                    selectedHour === hour
                      ? styles.timePicker_option_selected
                      : ""
                  }`}
                  onClick={() => handleHourSelect(hour)}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.timePicker_columnSeparator}>:</div>
          <div className={styles.timePicker_column}>
            <div className={styles.timePicker_columnHeader}>Min</div>
            <div className={styles.timePicker_scrollContainer}>
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`${styles.timePicker_option} ${
                    selectedMinute === minute
                      ? styles.timePicker_option_selected
                      : ""
                  }`}
                  onClick={() => handleMinuteSelect(minute)}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
