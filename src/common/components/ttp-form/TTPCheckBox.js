import { Checkbox, CheckboxProps } from "antd";
import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import React, { memo } from "react";
import styles from "./TTPForm.module.scss";
// import { LayoutTheme } from "@/common/constants/themes";

export function TTPCheckBox({ label, theme = "", className, ...props }) {
  return (
    <Checkbox
      className={classNames(className, styles.checkbox, styles[theme])}
      {...props}
    >
      {label}
    </Checkbox>
  );
}

export function TTPCheckBoxField({ ...props }) {
  const [field, meta, helpers] = useField({
    name: props.name,
    type: "checkbox",
  });

  const isChecked = field.value === props.value;
  return (
    <TTPCheckBox
      {...field}
      {...props}
      checked={isChecked}
      onChange={() => helpers.setValue(isChecked ? "" : props.value)}
    >
      <ErrorMessage
        name={props.name}
        component="p"
        className={props.errorsClassName ?? ""}
      />
    </TTPCheckBox>
  );
}

export default memo(TTPCheckBox);
