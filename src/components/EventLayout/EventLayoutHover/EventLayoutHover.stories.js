import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { EventLayoutHover } from "./EventLayoutHover";

export default {
  title: "EventLayoutHover",
  component: EventLayoutHover,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <EventLayoutHover
    setShowAddTags={action("setShowAddTags")}
    showAddTags={boolean("showAddTags", false)}
    setShowFocusConfig={action("setShowFocusConfig")}
    showFocusConfig={boolean("showFocusConfig", false)}
    isEvent={boolean("isEvent", true)}
  />
);
