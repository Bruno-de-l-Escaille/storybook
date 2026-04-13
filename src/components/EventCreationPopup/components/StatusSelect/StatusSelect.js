import React, { useState, useRef, useEffect } from "react";
import styles from "./StatusSelect.module.scss";

export const StatusSelect = ({ value, onChange, options, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className={styles.statusSelect} ref={selectRef}>
      <button
        type="button"
        className={`${styles.statusSelect_trigger} ${
          selectedOption
            ? styles[`statusSelect_trigger_${selectedOption.value}`]
            : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <span
            className={`${styles.statusSelect_badge} ${
              styles[`statusSelect_badge_${selectedOption.value}`]
            }`}
          >
            <span
              className={`${styles.statusSelect_dot} ${
                styles[`statusSelect_dot_${selectedOption.value}`]
              }`}
            ></span>
            {selectedOption.label}
          </span>
        ) : null}
        <div className={styles.statusSelect_iconWrapper}>
          <div className={styles.statusSelect_separator}></div>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className={`${styles.statusSelect_arrow} ${
              isOpen ? styles.statusSelect_arrow_open : ""
            }`}
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#6D7F92"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={styles.statusSelect_dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.statusSelect_option} ${
                styles[`statusSelect_option_${option.value}`]
              }`}
              onClick={() => handleSelect(option)}
            >
              <span
                className={`${styles.statusSelect_dot} ${
                  styles[`statusSelect_dot_${option.value}`]
                }`}
              ></span>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
