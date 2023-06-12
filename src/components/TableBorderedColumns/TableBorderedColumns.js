import React, { Component } from "react";
import styles from "./TableBorderedColumns.module.scss";

import classnames from "classnames";

export const TableBorderedColumns = (props) => {
  const {
    height,
    headerHeight,
    bordrerdcolumns,
    handleColumns,
    tableItems,
    isGestionTask,
    widthColumns,
  } = props;

  return (
    <div>
      <div>
        <div
          className={classnames(styles.table)}
          style={{
            height: headerHeight,
            borderBottom: "none",
          }}
        >
          <div
            style={{
              width: isGestionTask ? "19%" : "39%",
            }}
          >
            <div
              className={classnames(
                styles.table_item,
                isGestionTask
                  ? "cell small-4 medium-4 large-2"
                  : "cell small-4 medium-4 large-6"
              )}
            ></div>
          </div>
          {isGestionTask && (
            <div className={styles.total_line_percentage}>
              <div className={classnames(styles.table_item, styles.columns)} />
            </div>
          )}
          <div
            className={styles.bordered_columns}
            style={{
              width: widthColumns
                ? widthColumns
                : isGestionTask
                ? "74%"
                : "81%",
            }}
          >
            {bordrerdcolumns.map((column) => {
              return (
                <div
                  style={{
                    width: "150px",
                    height:
                      column.label !== "label" &&
                      column.label !== "totalPercentage" &&
                      "100%",
                  }}
                >
                  <div
                    className={classnames(styles.columns, styles.bordered_item)}
                  >
                    <div
                      className={classnames(
                        styles.bordered_column,
                        column.isBordered && styles.header_table,
                        column.label !== "label" &&
                          column.label !== "totalPercentage" &&
                          column.isBordered &&
                          !column.isEditable &&
                          styles.not_edited_bordered_column,
                        column.isBordered &&
                          !column.isEditable &&
                          column.isBordered &&
                          !column.isEditable &&
                          styles.total_header
                      )}
                      style={{
                        marginTop: "24px",
                      }}
                    >
                      <div
                        className={classnames(styles.value, styles.title)}
                        style={{
                          color:
                            column.isBordered &&
                            !column.isEditable &&
                            "#6D7F92",
                        }}
                      >
                        {column.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {tableItems.map((item, index1) => {
        return (
          <div>
            <div
              className={classnames(
                styles.table,
                item.label === "Total" && styles.line_buttom
              )}
              style={{
                height:
                  item.style === "header" || item.style === "footer"
                    ? headerHeight
                    : height,
                borderBottom:
                  (item.style === "header" || item.style === "footer") &&
                  "none",
              }}
            >
              <div
                style={{
                  width: isGestionTask && "39%",
                }}
              >
                <div
                  className={classnames(
                    styles.table_item,
                    item["label"] === "Total" && styles.total_title,
                    isGestionTask
                      ? "cell small-4 medium-4 large-2"
                      : "cell small-4 medium-4 large-6"
                  )}
                >
                  {item.label !== "header" && item.label !== "footer"
                    ? item["label"]
                    : ""}
                </div>
              </div>
              {isGestionTask && (
                <div className={styles.total_line_percentage}>
                  <div
                    className={classnames(styles.table_item, styles.columns)}
                  >
                    {item.label !== "header" && item.label !== "footer" && (
                      <div className={styles.item_percentage}>
                        {item["totalPercentage"]}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div
                className={styles.bordered_columns}
                style={{
                  width: widthColumns
                    ? widthColumns
                    : isGestionTask
                    ? "74%"
                    : "81%",
                }}
              >
                {bordrerdcolumns.map((column) => {
                  return (
                    <div
                      style={{
                        width: "150px",
                        height:
                          column.label !== "label" &&
                          column.label !== "totalPercentage" &&
                          "100%",
                      }}
                    >
                      <div
                        className={classnames(
                          styles.columns,
                          styles.bordered_item
                        )}
                      >
                        <div
                          className={classnames(
                            styles.bordered_column,
                            column.isBordered &&
                              column.label !== "label" &&
                              column.label !== "totalPercentage" &&
                              item.label === "footer" &&
                              styles.footer,
                            column.isBordered &&
                              !column.isEditable &&
                              styles.not_edited_bordered_column,
                            column.isBordered &&
                              !column.isEditable &&
                              item.label === "footer" &&
                              styles.not_edited_bordered_footer
                          )}
                          style={{
                            marginTop: item.label === "header" ? "24px" : "",
                          }}
                        >
                          {handleColumns(column, item, index1)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div>
        <div
          className={classnames(styles.table)}
          style={{
            height: headerHeight,
            borderBottom: "none",
          }}
        >
          <div
            style={{
              width: isGestionTask ? "19%" : "39%",
            }}
          >
            <div
              className={classnames(
                styles.table_item,
                isGestionTask
                  ? "cell small-4 medium-4 large-2"
                  : "cell small-4 medium-4 large-6"
              )}
            />
          </div>
          {isGestionTask && (
            <div className={styles.total_line_percentage}>
              <div className={classnames(styles.table_item, styles.columns)} />
            </div>
          )}
          <div
            className={styles.bordered_columns}
            style={{
              width: widthColumns
                ? widthColumns
                : isGestionTask
                ? "74%"
                : "81%",
            }}
          >
            {bordrerdcolumns.map((column) => {
              return (
                <div className={styles.item}>
                  <div
                    className={classnames(styles.columns, styles.bordered_item)}
                  >
                    <div
                      className={classnames(
                        styles.bordered_column,
                        column.isBordered && styles.footer,
                        column.isBordered &&
                          !column.isEditable &&
                          styles.not_edited_bordered_column,
                        styles.footer,
                        column.isBordered &&
                          !column.isEditable &&
                          styles.not_edited_bordered_column,
                        column.isBordered &&
                          !column.isEditable &&
                          styles.not_edited_bordered_footer
                      )}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
