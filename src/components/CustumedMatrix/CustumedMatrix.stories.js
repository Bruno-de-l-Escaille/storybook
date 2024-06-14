import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { CustumedMatrix } from "./CustumedMatrix";

export default {
  title: "CustumedMatrix",
  component: CustumedMatrix,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const columns = [
  { label: "Total", isEditable: false, widthPercentage: 12 },
  { label: "Superviseur", isEditable: true, widthPercentage: 12 },
  { label: "GD", isEditable: true, widthPercentage: 12 },
  { label: "SE", isEditable: true, widthPercentage: 12 },
  { label: "GE", isEditable: true, widthPercentage: 12 },
  { label: "ScanOp", isEditable: true, widthPercentage: 12 },
];

const tableItems = [
  {
    id:1,
    label: "Total",
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
    id:2,
    label: "Creation Modif Dossier",
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
    id:3,
    label: "Scan et admmin",
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
    id:4,
    label: "ORGANISATION COMPTABLE",
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
    id:5,
    label: "PRESTATIONS TVA",
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
    id:6,
    label: "ENCODAGE COMPTABLE",
    Total: { value_heure: "40 h", value_percentage: "100 %", checked: true },
    Superviseur: { value_heure: "8 h", value_percentage: "20 %" },
    GD: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    SE: { value_heure: "16 h", value_percentage: "40 %", checked: false },
    GE: { value_heure: "8 h", value_percentage: "20 %", checked: true },
    ScanOp: { value_heure: "40 h", value_percentage: "20 %", checked: true },
    details: [
      {
        label: "Child 3",
        Total: { value_heure: "50 h", value_percentage: "50 %", checked: true },
        Superviseur: { value_heure: "24 h", value_percentage: "12 %", checked: false },
        GD: { value_percentage: "12.5 %" },
        SE: { value_heure: "31 h", value_percentage: "15.5 %", checked: false },
        GE: { value_heure: "20 h", value_percentage: "10 %", checked: true },
        ScanOp: { value_heure: "20 h", value_percentage: "10 %", checked: true },
      },
    ]
  },
  {
    id:7,
    label: "NETTOYAGE ET VERIFICATION COMPTABILITE",
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
    details: [
      {
        label: "Child 1",
        Total: { value_heure: "50 h", value_percentage: "50 %", checked: true },
        Superviseur: { value_heure: "24 h", value_percentage: "12 %", checked: false },
        GD: { value_percentage: "12.5 %" },
        SE: { value_heure: "31 h", value_percentage: "15.5 %", checked: false },
        GE: { value_heure: "20 h", value_percentage: "10 %", checked: true },
        ScanOp: { value_heure: "20 h", value_percentage: "10 %", checked: true },
      },
      {
        label: "Child 2",
        Total: { value_heure: "50 h", value_percentage: "50 %", checked: true },
        Superviseur: { value_heure: "24 h", value_percentage: "12 %", checked: false },
        GD: { value_percentage: "12.5 %" },
        SE: { value_heure: "31 h", value_percentage: "15.5 %", checked: false },
        GE: { value_heure: "20 h", value_percentage: "10 %", checked: true },
        ScanOp: { value_heure: "20 h", value_percentage: "10 %", checked: true },
      },
    ],
  },
];

const handleColumns = (column, item) => {
  return item[column];
};

const renderTitleLine = (line) => {
  return line.label;
};

const handleChildTitle = (child) => {
  return <div>{child.label}</div>;
};

const handleChildCellule = (column, child) => {
  return <span>{child[column.label]?.value_percentage || ""}</span>;
};

export const Basic = () => (
  <div>
    <CustumedMatrix
      columns={columns}
      items={tableItems}
      handleTitle={renderTitleLine}
      handleCellule={handleColumns}
      headerTagBG={"#FFFFFF"}
      handleChildCellule={handleChildCellule}
      handleChildTitle={handleChildTitle}
    />
  </div>
);
