import React, { useState } from "react";
import styles from "./CustumedMatrix.module.scss";

import classnames from "classnames";

export const CustumedMatrix = (props) => {
  const {
    columns,
    items,
    handleCellule,
    handleTitle,
    headerTagBG,
    handleChildCellule,
    handleChildTitle,
  } = props;

  const [selectedLineId, setSelectedLineId] = useState(null);
  let titleWidth = 0;

  const handleLineClick = (lineId) => {
    if (selectedLineId === lineId) {
      setSelectedLineId(null);
    } else {
      setSelectedLineId(lineId);
    }
  };
  return (
    <div className={styles.matrix}>
      <div className={styles.matrix_header}>
        {columns.map((item) => {
          titleWidth += item.widthPercentage;
          return (
            <div
              key={item.label}
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
          const hasChildren = line.details && line.details.length > 0;
          const isSelected = selectedLineId === line.id;
          return (
            <>
              <div
                className={classnames(styles.matrix_body_line, {
                  [styles.pointer]: hasChildren,
                })}
                onClick={() => handleLineClick(line.id)}
              >
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
                isSelected &&
                line.details.map((child) => (
                  <div
                    key={child.id}
                    className={classnames(
                      styles.matrix_body_line,
                      styles.matrix_body_child
                    )}
                  >
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
                        key={column.label}
                        className={!column.isEditable && styles.disabled}
                        style={{ width: `${column.widthPercentage}%` }}
                      >
                        {handleChildCellule(column, line, child)}
                      </div>
                    ))}
                  </div>
                ))}
            </>
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
