import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { ArticleList } from "./ArticleList";
import jsonData from "./data2.json";
const articles = jsonData.data;

export default {
  title: "ArticleList",
  component: ArticleList,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};
const dispositions = [
  "default",
  "type1",
  "type2",
  "type3",
  "type4",
  "type5",
  "type6",
  "type7",
];

// const dispositions = ["default", "type1"];

export const Default = () => (
  <ArticleList
    articles={articles}
    dispositions={dispositions}
    isFetching={boolean("isFetching", false)}
    navCommunityId={9}
    env="local"
    host="local.blog.tamtam.pro"
    saveFavorite={(articleId) => console.log(articleId)}
    onLike={(articleId, like) => console.log(articleId, like)}
    openModal={(article) => console.log(article)}
    onEdit={(articleId) => console.log(articleId)}
  />
);

// export const Type2 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type2"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );

// export const Type3 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type3"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );

// export const Type4 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type4"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );

// export const Type5 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type5"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );

// export const Type6 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type6"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );

// export const Type7 = () => (
//   <div class="grid-container">
//     <ArticleList
//       type="type7"
//       articles={articles}
//       isFetching={boolean("isFetching", false)}
//     />
//   </div>
// );
