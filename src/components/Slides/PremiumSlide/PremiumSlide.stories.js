import React from "react";
import { withKnobs, select, boolean, object } from "@storybook/addon-knobs";
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
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
  />
);
