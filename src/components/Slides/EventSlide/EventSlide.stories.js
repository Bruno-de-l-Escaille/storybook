import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
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
    env="v2"
  />
);
