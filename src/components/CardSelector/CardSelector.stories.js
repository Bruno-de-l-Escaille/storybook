import React from "react";
import CardSelector from "./CardSelector";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import * as icons from "../Icons";

export default {
  title: "CardSelector",
  component: CardSelector,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};
const onClick = () => alert("it's clicked");

const IconHome = icons["Ebox"];
const IconEbox = icons["Profile"];
const IconText = icons["Apps"];
const IconUrl = icons["Ebox"];

const name = "editor";

const selectorsTab = [
  {
    name: name,
    label: "emailing",
    description: "Easily create your own custom newsletter.",
    icon: IconHome,
    onClick: onClick,
  },
  {
    name: name,
    label: "newsletter",
    description: "Create your custom template email with simple drag&drop.",
    icon: IconEbox,
    onClick: onClick,
  },
  {
    name: name,
    label: "Rich Text",
    description: "Use the rich text editor to create simple emails.",
    icon: IconText,
    onClick: onClick,
  },
  {
    name: name,
    label: "From URL",
    description:
      "Create a campaign by importing the HTML code directly from a hosted URL.",
    icon: IconUrl,
    onClick: onClick,
  },
];

export const Primary = () => {
  return <CardSelector selectorsTab={selectorsTab} />;
};
