import classNames from "classnames";
import React, { memo } from "react";
import styles from "./switcher.module.scss";

export default memo(({ checked, label, disabled, theme = "", onChange }) => (
  <label
    className={classNames(
      styles.switcher,
      disabled && styles.disabled,
      styles[theme]
    )}
  >
    <input
      disabled={disabled}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label && <span>{label}</span>}
    <span className={styles.checkMark} />
  </label>
));
