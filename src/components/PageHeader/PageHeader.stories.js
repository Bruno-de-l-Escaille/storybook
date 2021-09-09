import React from "react";
import PageHeader from "./PageHeader";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { ReactComponent as HomeSVG } from "../Icons/home.svg";
import { ReactComponent as PlusIcon } from "../Icons/home.svg";
import { ReactComponent as PencilIcon } from "../Icons/home.svg";

export default {
  title: "PageHeader",
  component: PageHeader,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

const Buttons = [
  {
    label: "Add",
    Icon: PlusIcon,
    style: "secondary",
    onClick: () => alert("Button Add"),
  },
  {
    label: "Modify",
    Icon: PencilIcon,
    style: "secondary-steps",
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
    Icon={HomeSVG}
  />
);

export const PageHeaderWithButtons = () => {
  return (
    <PageHeader
      header="Dashboard"
      subHeader="view your campaigns stats"
      Icon={HomeSVG}
      buttons={Buttons}
    />
  );
};
