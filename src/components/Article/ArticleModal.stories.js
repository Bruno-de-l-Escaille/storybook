import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { ArticleModal } from "./ArticleModal";

export default {
  title: "ArticleModal",
  component: ArticleModal,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

let showModal = false;

function handleOpenModal() {
  console.log("handle click");
  showModal = true;
}

export const Default = () => (
  <div>
    <button onClick={handleOpenModal}>Trigger Modal</button>
    <ArticleModal showModal={showModal} />
  </div>
);
