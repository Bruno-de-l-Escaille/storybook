import classNames from "classnames";
import { ErrorMessage, Field, useField } from "formik";
import React, { memo } from "react";
import styles from "./TTPForm.module.scss";
import { isEmpty } from "../../../utils";

function TTPRadioGroup({
  theme = "",
  name,
  label,
  options,
  wrapperClassName,
  optionsWrapperClassName,
  value,
  required,
  isHorizontal,
  labelClassName,
  children,
  onChange,
  ...inputProps
}) {
  return (
    <div
      className={classNames(styles.ttpField, wrapperClassName, styles[theme])}
    >
      <div className={classNames(isHorizontal && styles.hGroup)}>
        {label && (
          <div className={classNames(styles.inputLabel, labelClassName)}>
            {label}
            {required && !isEmpty(label.trim()) && (
              <span className={styles.required}>*</span>
            )}
          </div>
        )}
        <div>
          <div
            className={classNames(
              styles.optionsWrapper,
              optionsWrapperClassName
            )}
          >
            {options.map((option) => (
              <label className={styles.option} key={option.value}>
                <input
                  name={name}
                  id={`input-${name}`}
                  type="radio"
                  checked={option.value === value}
                  value={option.value}
                  onChange={onChange}
                  {...inputProps}
                />
                <span
                  className={styles.radioButton}
                  style={
                    option.value === value && option.activeColor
                      ? { background: option.activeColor }
                      : undefined
                  }
                >
                  {option.value === value ? (
                    <span className={styles.checkedCircle} />
                  ) : (
                    ""
                  )}
                </span>
                {option.label}
              </label>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function TTPRadioGroupField({ ...props }) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <TTPRadioGroup {...field} {...props}>
      <ErrorMessage
        name={props.name}
        component="p"
        className={props.errorsClassName ?? ""}
      />
    </TTPRadioGroup>
  );
}

export default memo(TTPRadioGroup);
