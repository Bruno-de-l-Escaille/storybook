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

const indexedEvents = events.reduce((acc, event) => {
  acc[event.nameFr || event.nameNl || event.nameEn] = event;
  return acc;
}, {});

export const Default = () => (
  <EventLayout
    event={select("event", indexedEvents, events[0])}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local", "preprod"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
    token="231f67ec6bc68df3bd1cf8d2e53a3ac394f1774f"
    userId={null}
    dict={null}
    isAdmin={boolean("isAdmin", false)}
    isOFFFcourse={boolean("isOFFFcourse", false)}
  />
);
