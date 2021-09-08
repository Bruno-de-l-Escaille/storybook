import React from "react";
import { PageHeader } from "./PageHeader";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: "PageHeader",
  component: PageHeader,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const PageHeaderWithoutButton = () => (
  <PageHeader
    header="Dashboard"
    subHeader="view your campaigns stats"
    icon="Portal"
  />
);




/*
const Buttons = [
  {
    label: "Button1",
    style:"secondary",
    onClick:""
  },
  {
    label: "Button2",
    style:"primary-steps",
    onClick:""
  },
  {
    label: "Button3",
    style:"disabled",
    onClick:""
  },
];

export const PageHeaderWithButtons = () => {
  return (
    <PageHeader
      header="Dashboard"
      subHeader="view your campaigns stats"
      icon="DASHBOARD"
    >
      {Buttons}
    </PageHeader>
  );
};
*/
