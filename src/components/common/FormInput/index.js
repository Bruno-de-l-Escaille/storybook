import React from "react";
import classnames from "classnames";

import styles from "./FormInput.module.scss";

const FormInput = ({
  label,
  type,
  className,
  labelClassName,
  error,
  required,
  inputRef,
  handleBlur,
  handleKeyUp,
  handleChange,
  hideLockIcon,
  rightIcon,
  ...otherProps
}) => {
  const { disabled } = otherProps;

  return (
    <div className={styles.group}>
      <label className={classnames(styles.label, labelClassName)}>
        {label}
        {required ? <span className={styles.star}>*</span> : null}
        {disabled && !hideLockIcon ? (
          <span className={styles.star}>
            <i className="icon-ttp-locked"></i>
          </span>
        ) : null}
      </label>
      <div className={styles.inputContainer}>
        {type === "textarea" ? (
          <textarea
            className={classnames(styles.input, className)}
            ref={inputRef}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            {...otherProps}
          ></textarea>
        ) : (
          <input
            className={classnames(
              styles.input,
              error ? styles.error : "",
              className
            )}
            ref={inputRef}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            type={
              type === "password"
                ? "password"
                : type === "date"
                ? "date"
                : "text"
            }
            {...otherProps}
          />
        )}
        {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
      </div>
      <span className={styles.error}>{error}</span>
    </div>
  );
};

export default FormInput;
