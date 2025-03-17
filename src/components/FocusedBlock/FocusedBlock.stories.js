import React from "react";
import { withKnobs, select, boolean, object } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { FocusedBlock } from "./FocusedBlock";
import data from "./data.json";

const events = data.data.events;
const cycles = data.data.cycles;

export default {
  title: "Slides/FocusedBlock",
  component: FocusedBlock,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <FocusedBlock
    events={events}
    cycles={cycles}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local", "preprod"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
    isMasterChaine={boolean("isMasterChaine", false)}
    isAdmin={boolean("isAdmin", false)}
    isOFFFcourse={boolean("isOFFFcourse", false)}
    token="231f67ec6bc68df3bd1cf8d2e53a3ac394f1774f"
  />
);
