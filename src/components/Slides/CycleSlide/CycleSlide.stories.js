import React from "react";
import { withKnobs, select, boolean, object } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import data from "./data.json";
import { CycleSlide } from "./CycleSlide";

const cycle = data.cycles[0];
const essential = data.cycles[1];
const season = data.cycles[2];

export default {
  title: "Slides/CycleSlide",
  component: CycleSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export function Type1() {
  return (
    <CycleSlide
      cycle={cycle}
      language={select("language", ["fr", "nl", "en"], "fr")}
      isFetching={boolean("isFetching", false)}
      env={select("env", ["production", "staging", "local"], "v2")}
      isUserMember={boolean("isUserMember", false)}
      isUserPremium={boolean("isUserPremium", false)}
      queryParams={object("queryParams", {})}
    />
  );
}

export const Type2 = () => (
  <CycleSlide
    cycle={essential}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
  />
);

export const Type3 = () => (
  <CycleSlide
    cycle={season}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
  />
);
