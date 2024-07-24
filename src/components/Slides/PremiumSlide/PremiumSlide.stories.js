import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import data from "./data.json";
import { PremiumSlide } from "./PremiumSlide";

const cycle = data.cycles[0];

export default {
  title: "Slides/PremiumSlide",
  component: PremiumSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "1rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <PremiumSlide
    cycle={cycle}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);
