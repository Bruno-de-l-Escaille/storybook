import React from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { Article } from "./Article";

import jsonData from "./data2.json";

// import articles from "../../articles2.js";

const articles = jsonData.data;
// const article = jsonData.data[0];

export default {
  title: "Article",
  component: Article,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const DefaultSmall = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          size="small"
          isFetching={boolean("isFetching", false)}
          navCommunityId=""
          env="v2"
          onEdit={() => console.log("edit")}
        />
      </div>
    </div>
  </div>
);

export const DefaultLarge = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-8">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          size="large"
          showSummary={true}
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);

export const Type2 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type2"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
        />
      </div>
    </div>
  </div>
);

export const Type3 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-6">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type3"
          showStatus={boolean("showStatus", false)}
          onDelete={() => console.log("onDelete")}
          onPublish={() => console.log("onPublish")}
          onEdit={() => console.log("onEdit")}
          saveFavorite={() => console.log("saveFavorite")}
          isFetching={boolean("isFetching", false)}
        />
      </div>
    </div>
  </div>
);

export const Type4 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type4"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);

export const Type5 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-3">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type5"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);

export const Type6 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-6">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type6"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);

export const Type7 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-3">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type7"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);

export const Type8 = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-6">
        <Article
          article={articles[Math.floor(Math.random() * 20)]}
          showSummary={true}
          type="type8"
          isFetching={boolean("isFetching", false)}
          onEdit={() => console.log("edit")}
          onLike={() => console.log("like")}
          user={{ id: 12 }}
        />
      </div>
    </div>
  </div>
);
