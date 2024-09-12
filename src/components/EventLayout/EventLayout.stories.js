import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select, object } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import events from "./data.json";
import { EventLayout } from "./EventLayout";

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
    event={events[0]}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
    token="30165da214f80f1c5de25da2c059fbf29315f3b8"
    userId={null}
    dict={null}
  />
);
