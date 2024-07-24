import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import cycles from "./data.json";
import CycleCard from "./CycleCard";

export default {
  title: "CycleCard",
  component: CycleCard,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <CycleCard
    language="fr"
    cycle={cycles[2]}
    isUserMember={false}
    isFetching={boolean("isFetching", false)}
    env="v2"
  />
);
