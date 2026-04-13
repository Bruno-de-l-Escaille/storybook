import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import React, { memo } from "react";
import InputMask, {
  BeforeMaskedStateChangeStates,
  InputState,
} from "react-input-mask";
import ReactTooltip from "react-tooltip";
// import { Tooltip } from "react-tooltip";
import HelpIcon from "./assets/alert-circle.svg";
import styles from "./TTPForm.module.scss";
import { isEmpty } from "../../../utils";

export function TTPInput({
  customizeError,
  theme = "",
  name,
  label,
  className,
  wrapperClassName,
  required,
  value,
  isHorizontal,
  labelClassName,
  tooltip,
  tooltipIcon,
  children,
  hasError,
  isInputMask,
  mask,
  beforeMaskStateChange,
  hasWarning,
  ...inputProps
}) {
  const renderTooltip = (message) => (
    <span className="flex-container align-middle m-l-xs">
      {tooltipIcon ?? (
        <span data-tip="" data-for={`tooltip-${name}`}>
          <HelpIcon
            height="14px"
            width="14px"
            fill="#B2BCC6"
            className="m-l-xs"
          />
        </span>
      )}
      <ReactTooltip
        id={`tooltip-${name}`}
        effect="float"
        type="light"
        className={classNames("portal-tooltip", styles.tooltip)}
        html
      >
        {message}
      </ReactTooltip>
    </span>
  );
  return (
    <div
      className={classNames(styles.ttpField, wrapperClassName, styles[theme])}
    >
      <div className={classNames(isHorizontal && styles.hGroup)}>
        {label && (
          <label
            htmlFor={`input-${name}`}
            className={classNames(
              styles.inputLabel,
              labelClassName,
              "flex-container"
            )}
          >
            {label}
            {required && <span className={styles.required}>*</span>}
            {tooltip && renderTooltip(tooltip)}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {isInputMask ? (
            <InputMask
              id={`input-${name}`}
              beforeMaskedStateChange={beforeMaskStateChange ?? null}
              name={name}
              className={classNames(
                styles.field,
                hasError && styles.hasError,
                className,
                !isEmpty(value) ? styles.notEmpty : ""
              )}
              value={value}
              mask={mask ?? ""}
              alwaysShowMask
              {...inputProps}
            />
          ) : (
            <input
              name={name}
              className={classNames(
                styles.field,
                hasError && styles.hasError,
                hasWarning && styles.hasWarning,
                className,
                !isEmpty(value) ? styles.notEmpty : ""
              )}
              value={value}
              {...inputProps}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function TTPInputField({ ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <TTPInput
      {...field}
      {...props}
      hasError={!isEmpty(meta.error) && meta.touched}
    >
      {props.customizeError ? (
        ""
      ) : (
        <ErrorMessage name={props.name} component="p" />
      )}
    </TTPInput>
  );
}

export default memo(TTPInput);
