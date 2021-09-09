import React, {useState} from "react";
import Bubbles from "./Bubbles";
import { withKnobs, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import {
  SVG_EBOX_GALLERY_ICON,
  SVG_ENVELOPE_ICON,
  SVG_SEND_ICON,
  SVG_SETTINGS_ICON,
  SVG_USER_ICON,
} from "./SvgIcon/icon";

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
    label: "send",
    svg: SVG_SEND_ICON,
  },
  {
    id: "2",
    label: "Gallery",
    svg: SVG_EBOX_GALLERY_ICON,
  },
  {
    id: "3",
    label: "Preferences",

    svg: SVG_SETTINGS_ICON,
  },
  {
    id: "4",
    label: "recipients",
    svg: SVG_USER_ICON,
  },
  {
    id: "5",
    label: "test",
    svg: SVG_ENVELOPE_ICON,
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
