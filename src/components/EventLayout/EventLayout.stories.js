import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import events from "./data.json";
import EventLayout from "./EventLayout";

export default {
  title: "EventLayout",
  component: EventLayout,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <EventLayout
    language="fr"
    event={events[0]}
    isUserMember={false}
    isFetching={boolean("isFetching", false)}
    env="v2"
  />
);
