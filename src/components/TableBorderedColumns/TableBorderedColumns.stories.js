import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import classnames from "classnames";
import { TableBorderedColumns } from "./TableBorderedColumns";
import styles from "./TableBorderedColumns.module.scss";

export default {
  title: "TableBorderedColumns",
  component: TableBorderedColumns,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const bordrerdcolumns = [
  { label: "Total", haveHeader: true, isBordered: true, isEditable: false },
  {
    label: "Superviseur",
    haveHeader: true,
    isBordered: true,
    isEditable: true,
  },
  { label: "GD", haveHeader: true, isBordered: true, isEditable: true },
  { label: "SE", haveHeader: true, isBordered: true, isEditable: true },
  { label: "GE", haveHeader: true, isBordered: true, isEditable: true },
  { label: "ScanOp", haveHeader: true, isBordered: true, isEditable: true },
];

const tableItems = [
  {
    label: "Total",
    style: "total",
    totalPercentage: "100%",
    Total: { value_heure: "200 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "48 h",
      value_percentage: "24 %",
      checked: false,
    },
    GD: { value_percentage: "25 %" },
    SE: { value_heure: "62 h", value_percentage: "31 %", checked: false },
    GE: { value_heure: "40 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: "Creation Modif Dossier",
    style: "content",
    totalPercentage: "10%",
    Total: { value_heure: "20 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "8 h",
      value_percentage: "40 %",
      checked: false,
    },
    GD: { value_heure: "4 h", value_percentage: "20 %", checked: false },
    SE: { value_heure: "4 h", value_percentage: "20 %", checked: true },
    GE: { value_heure: "4 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: "Scan et admmin",
    style: "content",
    totalPercentage: "10%",
    Total: { value_heure: "20 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "8 h",
      value_percentage: "40 %",
      checked: false,
    },
    GD: { value_heure: "4 h", value_percentage: "20 %", checked: false },
    SE: { value_heure: "4 h", value_percentage: "20 %", checked: true },
    GE: { value_heure: "4 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: "ORGANISATION COMPTABLE",
    style: "content",
    totalPercentage: "15%",
    Total: { value_heure: "30 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "6 h",
      value_percentage: "20 %",
      checked: false,
    },
    GD: { value_heure: "6 h", value_percentage: "20 %", checked: true },
    SE: { value_heure: "12 h", value_percentage: "40 %", checked: false },
    GE: { value_heure: "6 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: "PRESTATIONS TVA",
    style: "content",
    totalPercentage: "25%",
    Total: { value_heure: "50 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "10 h",
      value_percentage: "20 %",
      checked: false,
    },
    GD: { value_heure: " 20 h", value_percentage: "40 %", checked: true },
    SE: { value_heure: "10 h", value_percentage: "20 %", checked: false },
    GE: { value_heure: "10 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: " ENCODAGE COMPTABLE",
    style: "content",
    totalPercentage: "20%",
    Total: { value_heure: "40 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "8 h",
      value_percentage: "20 %",
      checked: false,
    },
    GD: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    SE: { value_heure: "16 h", value_percentage: "40 %", checked: false },
    GE: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  {
    label: "  NETTOYAGE ET VERIFICATION COMPTABILITE",
    style: "content",
    totalPercentage: "20%",
    Total: { value_heure: "40 h", value_percentage: "100 %", checked: true },
    Superviseur: {
      value_heure: "8 h",
      value_percentage: "20 %",
      checked: false,
    },
    GD: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    SE: { value_heure: "16 h", value_percentage: "40 %", checked: false },
    GE: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
  },
  // {
  //   label: "footer",
  //   style: "footer",
  // },
];

const handleColumns = (column, item) => {
  return (
    <>
      {column.label !== "label" &&
        column.label !== "totalPercentage" &&
        item.label !== "header" &&
        item.label !== "footer" && (
          <div style={{ margin: "auto" }}>
            <input
              type="text"
              className={classnames(
                styles.input_box,
                styles.label,
                (item.label === "Total" || item[column.label]["checked"]) &&
                  styles.disabled,
                column.label === "Total" &&
                  item[column.label]["value_percentage"] === "100 %" &&
                  styles.sucess_total,
                column.label === "Total" &&
                  item[column.label]["value_percentage"] !== "100 %" &&
                  styles.insucess_total
              )}
              value={item[column.label]["value_percentage"]}
              required={true}
              style={{
                border:
                  item["Total"]["value_percentage"] !== "100 %"
                    ? "1px solid #de4848"
                    : "",
              }}
            />
          </div>
        )}
    </>
  );
};

export const Basic = () => (
  <div>
    <TableBorderedColumns
      height={"83px"}
      headerHeight={"58px"}
      bordrerdcolumns={bordrerdcolumns}
      handleColumns={handleColumns}
      tableItems={tableItems}
      isGestionTask={false}
      // widthColumns={"60%"}
    />
  </div>
);
