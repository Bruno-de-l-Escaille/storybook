import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import data from "./data.json";
import { MembershipSlide } from "./MembershipSlide";

const membership = data.memberships[0];

export default {
  title: "Slides/MembershipSlide",
  component: MembershipSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <MembershipSlide
    membership={membership}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);
