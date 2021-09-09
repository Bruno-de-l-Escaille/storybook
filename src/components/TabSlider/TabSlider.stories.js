import React, { useState } from "react";
import TabSlider from "./TabSlider";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { Settings, Profile, Ebox, Apps } from "../Icons";

export default {
  title: "TabSlider",
  component: TabSlider,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};
const TABSLIDER = [
  {
    label: "tab1",
    icon: <Settings />,
  },
  {
    label: "tab2",
    icon: <Profile />,
  },
  {
    label: "tab3",
    icon: <Ebox />,
  },
  {
    label: "tab4",
    icon: <Apps />,
  },
];
export const Primary = () => {
  const [currentTab, setCurrentTab] = useState();

  return (
    <TabSlider
      tabs={TABSLIDER}
      activeTab={currentTab}
      selectTab={(tab) => setCurrentTab(tab)}
    />
  );
};
