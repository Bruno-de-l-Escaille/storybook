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
    token="59fe1c09d5d0d1454539d61bb01ffae9a7ed3095"
    userId={null}
    dict={null}
    isAdmin={boolean("isAdmin", false)}
    isOFFFcourse={boolean("isOFFFcourse", false)}
    isMasterChaine={boolean("isMasterChaine", false)}
  />
);
