import React from "react";
import PageHeader from "./PageHeader";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { Search, Check, Portal } from "../Icons";

export default {
  title: "PageHeader",
  component: PageHeader,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

const Buttons = [
  {
    label: "Check",
    Icon: Check,
    style: "secondary",
    onClick: () => alert("Button Add"),
  },
  {
    label: "Search",
    Icon: Search,
    style: "warning",
    onClick: () => console.log(),
  },
  {
    label: "Link",
    style: "disabled",
    onClick: () => console.log(),
  },
];

export const PageHeaderWithoutButton = () => (
  <PageHeader
    header="Dashboard"
    subHeader="view your campaigns stats"
    Icon={Portal}
  />
);

export const PageHeaderWithButtons = () => {
  return (
    <PageHeader
      header="Dashboard"
      subHeader="view your campaigns stats"
      Icon={Portal}
      buttons={Buttons}
    />
  );
};
