import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { AuthorCard } from "./AuthorCard";
import dataJson from "./data.json";
const authors = dataJson.data;

export default {
  title: "AuthorCard",
  component: AuthorCard,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <div
    className="grid-container"
    style={{ background: "#FAFBFB", padding: "200px 20px 20px" }}
  >
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-4">
        <AuthorCard
          onAvatarClick={action("onAvatarClick")}
          author={authors[Math.floor(Math.random() * 34)]}
          lng="en"
          isFetching={boolean("isFetching", false)}
        />
      </div>
    </div>
  </div>
);

export const FetchingAuthor = () => (
  <div
    className="grid-container"
    style={{ background: "#FAFBFB", padding: "200px 20px 20px" }}
  >
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-4">
        <AuthorCard isFetching={true} />
      </div>
    </div>
  </div>
);
