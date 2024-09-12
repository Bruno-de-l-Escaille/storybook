import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select, object } from "@storybook/addon-knobs";
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

const onClick = (id, type, pathname) => {
  alert(`id: ${id}, type: ${type}, pathname: ${pathname}`);
};

export const Type1 = () => (
  <CycleCard
    cycle={cycles[0]}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
  />
);

export const Type2 = () => {
  return (
    <CycleCard
      cycle={cycles[1]}
      language={select("language", ["fr", "nl", "en"], "fr")}
      isFetching={boolean("isFetching", false)}
      env={select("env", ["production", "staging", "local"], "v2")}
      isUserMember={boolean("isUserMember", false)}
      isUserPremium={boolean("isUserPremium", false)}
      queryParams={object("queryParams", {})}
    />
  );
};

export const Type3 = () => (
  <CycleCard
    cycle={cycles[2]}
    language={select("language", ["fr", "nl", "en"], "fr")}
    isFetching={boolean("isFetching", false)}
    env={select("env", ["production", "staging", "local"], "v2")}
    isUserMember={boolean("isUserMember", false)}
    isUserPremium={boolean("isUserPremium", false)}
    queryParams={object("queryParams", {})}
    onClick={onClick}
  />
);
