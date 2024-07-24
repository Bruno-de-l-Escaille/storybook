import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
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

export function Cycle() {
  return (
    <CycleSlide
      cycle={cycle}
      language={select("language", ["fr", "nl", "en"], "fr")}
      env="v2"
      isFetching={boolean("isFetching", false)}
    />
  );
}

export const Essential = () => (
  <CycleSlide
    cycle={essential}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);

export const Season = () => (
  <CycleSlide
    cycle={season}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);
