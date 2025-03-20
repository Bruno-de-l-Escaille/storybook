import React from "react";
import { withKnobs, select, boolean, object } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { EventSlide } from "./EventSlide";
import data from "./data.json";

const event = data.events[0];

export default {
  title: "Slides/EventSlide",
  component: EventSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <EventSlide
    event={event}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local", "preprod"], "local")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
    isMasterChaine={boolean("isMasterChaine", false)}
    isAdmin={boolean("isAdmin", false)}
    isOFFFcourse={boolean("isOFFFcourse", false)}
    token="59fe1c09d5d0d1454539d61bb01ffae9a7ed3095"
  />
);
