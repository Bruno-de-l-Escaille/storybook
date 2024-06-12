import React from "react";
import styles from "./CustumedMatrix.module.scss";

import classnames from "classnames";

export const CustumedMatrix = (props) => {
  const {
    columns,
    items,
    handleCellule,
    handleTitle,
    headerTagBG,
    hasDetails,
    handleChildCellule,
    handleChildTitle
  } = props;

  let titleWidth = 0;
  return (
    <div className={styles.matrix}>
      <div className={styles.matrix_header}>
        {columns.map((item) => {
          titleWidth += item.widthPercentage;
          return (
            <div
              className={classnames(
                styles.matrix_header_column,
                !item.isEditable && styles.disabled
              )}
              style={{ width: `${item.widthPercentage}%` }}
            >
              <div
                style={{ background: headerTagBG ? headerTagBG : "#F4F7F9" }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.matrix_body}>
        {items.map((line) => {
          const hasChildren = line.children && line.children.length > 0;

          return (
            <div>
              <div className={styles.matrix_body_line}>
                <div style={{ width: `${100 - titleWidth - 6}%` }}>
                  {handleTitle(line)}
                </div>
                {columns.map((column) => (
                  <div
                    className={!column.isEditable && styles.disabled}
                    style={{ width: `${column.widthPercentage}%` }}
                  >
                    {handleCellule(column, line)}
                  </div>
                ))}
              </div>
              {hasChildren &&
                line.children.map((child) => (
                  <div className={styles.matrix_body_line}>
                    <div
                      style={{
                        width: `${100 - titleWidth - 6}%`,
                        paddingLeft: "20px",
                      }}
                    >
                      {handleChildTitle(child)}
                    </div>
                    {columns.map((column) => (
                      <div
                        className={!column.isEditable && styles.disabled}
                        style={{ width: `${column.widthPercentage}%` }}
                      >
                        {handleChildCellule(column, child)}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
      <div className={styles.matrix_footer}>
        {columns.map((item) => {
          return (
            <div
              className={classnames(
                styles.matrix_footer_column,
                !item.isEditable && styles.disabled
              )}
              style={{ width: `${item.widthPercentage}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};
