import React from "react";

import Select from "react-select";
import styles from "../FormInput/FormInput.module.scss";

import { SELECT_STYLES} from "../../../config";

const FormSelect = ({
  handleChange,
  isSearchable,
  value,
  label,
  name,
  options,
  error,
  info,
  required,
  handleBlur,
  isMulti,
}) => (
  <div className={styles.group}>
    <label className={styles.label}>
      {label}
      {required ? <span className={styles.star}>*</span> : null}
      {info ? (
        <div className={styles.info}>
          <i className="icon-ttp-alert-circle"></i>
          <ul>
            <li>{info}</li>{" "}
          </ul>
        </div>
      ) : null}
    </label>
    <Select
      isMulti={isMulti}
      styles={SELECT_STYLES}
      options={options}
      isSearchable={isSearchable}
      name="name"
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
    />
    <span className={styles.error}>{error}</span>
  </div>
);

export default FormSelect;
