import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import cycles from "./data.json";
import { CycleCard } from "./CycleCard";

export default {
  title: "CycleCard",
  component: CycleCard,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Cycle = () => (
  <CycleCard
    language="fr"
    cycle={cycles[0]}
    isUserMember={false}
    isFetching={boolean("isFetching", false)}
    env="v2"
  />
);

export const Season = () => (
  <CycleCard
    language="fr"
    cycle={cycles[1]}
    isUserMember={false}
    isFetching={boolean("isFetching", false)}
    env="v2"
  />
);

export const Essential = () => (
  <CycleCard
    language="fr"
    cycle={cycles[2]}
    isUserMember={false}
    isFetching={boolean("isFetching", false)}
    env="v2"
  />
);
