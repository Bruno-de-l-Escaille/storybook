import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import React, { memo, useState } from "react";
import { default as Select } from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import formStyles from "../TTPForm.module.scss";
import {
  DropdownIndicator,
  findSelectedValue,
  getAsyncSelectStyles,
  getSelectStyles,
  LoadingMessage,
  Menu,
  NoOptionsMessage,
} from "./services";
// import { LayoutTheme } from '@/common/constants/themes';
// import { TTPFormFieldProps } from '@/common/types/ttp-form/interfaces';

function TTPSelect({
  theme = "",
  name,
  required,
  labelClassName,
  options,
  value,
  wrapperClassName,
  isHorizontal,
  label,
  children,
  textStyle,
  inputStyle,
  hasError,
  selected,
  ...props
}) {
  const { isAsync } = props ?? {};

  const SelectComponent = props.isCreatable
    ? CreatableSelect
    : isAsync
    ? AsyncSelect
    : Select;

  const selectStyles = isAsync
    ? getAsyncSelectStyles(theme, textStyle, inputStyle)
    : getSelectStyles(theme, textStyle, inputStyle, hasError, selected);

  return (
    <div
      className={classNames(
        wrapperClassName,
        formStyles.ttpField,
        formStyles[theme]
      )}
    >
      <div className={classNames(isHorizontal && formStyles.hGroup)}>
        {label && (
          <label
            htmlFor={`input-${name}`}
            className={classNames(formStyles.inputLabel, labelClassName)}
          >
            {label}
            {required && <span className={formStyles.required}>*</span>}
          </label>
        )}
        <div className={formStyles.inputWrapper}>
          <SelectComponent
            classNamePrefix="ttp_form_select"
            label="Single select"
            styles={selectStyles}
            components={{
              // DropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
              Menu,
            }}
            options={options}
            value={
              value !== undefined ? findSelectedValue(value, options) : value
            }
            {...props}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export function TTPSelectField({ onChange, onBlur = null, options, ...props }) {
  const { isAsync, defaultOptions } = props ?? {};
  const [field, meta, helpers] = useField(props.name ?? "");
  const [asyncOptions, setAsyncOptions] = useState(
    isAsync ? defaultOptions : []
  );

  const handleOnChange = (option) => {
    const fieldValue =
      option instanceof Array
        ? option.map((item) => item.value)
        : option?.value;
    (() => {
      helpers.setValue(fieldValue);
    })();
    setAsyncOptions(option ? [...asyncOptions, option] : []);
  };

  return (
    <TTPSelect
      {...field}
      {...props}
      onChange={onChange || handleOnChange}
      onBlur={() => {
        !meta.touched && helpers.setTouched(true);
      }}
      options={isAsync ? asyncOptions : options}
    >
      {props.customizeError ? (
        ""
      ) : (
        <ErrorMessage name={props.name ?? ""} component="p" />
      )}
    </TTPSelect>
  );
}

export default memo(TTPSelect);
