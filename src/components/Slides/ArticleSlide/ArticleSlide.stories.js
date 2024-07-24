import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import data from "./data.json";
import { ArticleSlide } from "./ArticleSlide";

const article = data.articles[0];

export default {
  title: "Slides/ArticleSlide",
  component: ArticleSlide,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <ArticleSlide
    article={article}
    language={select("language", ["fr", "nl", "en"], "fr")}
    env="v2"
    isFetching={boolean("isFetching", false)}
  />
);
