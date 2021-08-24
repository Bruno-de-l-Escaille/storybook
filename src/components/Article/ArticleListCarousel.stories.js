import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { ArticleListCarousel } from "./ArticleListCarousel";

import jsonData from "./data2.json";
const articles = jsonData.data;

export default {
  title: "ArticleListCarousel",
  component: ArticleListCarousel,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const dispositions = ["type7", "type3", "type7", "default", "type2"];

export const Default = () => (
  <div className="grid-container">
    <ArticleListCarousel dispositions={dispositions} articles={articles} />
  </div>
);
