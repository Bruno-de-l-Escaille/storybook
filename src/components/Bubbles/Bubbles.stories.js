import React, { useState } from "react";
import Bubbles from "./Bubbles";
import { withKnobs, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { Check, Help, IconFacebook, IconLinkedin, IconTwitter } from "../Icons";
export default {
  title: "Bubbles",
  component: Bubbles,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};
const BUBBLES = [
  {
    id: "1",
    label: "help",
    icon: <Help />,
  },
  {
    id: "2",
    label: "Check",
    icon: <Check />,
  },
  {
    id: "3",
    label: "Facebook",
    icon: <IconFacebook />,
  },
  {
    id: "4",
    label: "Linkedin",
    icon: <IconLinkedin />,
  },
  {
    id: "5",
    label: "Twitter",
    icon: <IconTwitter />,
  },
];
const ButtonType = ["primary", "warning", "success", "danger", "secondary"];

export const Primary = () => {
  const [currentTab, setCurrentTab] = useState();

  return (
    <Bubbles
      tabs={BUBBLES}
      onBubbleClick={(status) => console.log(status)}
      ButtonType={select("select a type", ButtonType, "primary")}
      activeTab={currentTab}
      selectTab={(tab) => setCurrentTab(tab)}
    />
  );
};
