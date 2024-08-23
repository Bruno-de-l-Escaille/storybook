import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import data from "./data.json";
import { CustomisedSlide } from "./CustomisedSlide";

const customised = data.customised[0];

export default {
  title: "Slides/CustomisedSlide",
  component: CustomisedSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <CustomisedSlide
    data={customised}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);
