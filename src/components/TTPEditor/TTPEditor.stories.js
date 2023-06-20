import React from "react";
import { TTPEditor } from "./TTPEditor";
import {
  withKnobs,
  text,
  object,
  boolean,
  select,
  array,
} from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: "TTPEditor",
  component: TTPEditor,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const Default = () => (
  <TTPEditor
    lng={select("language", ["fr", "nl", "en"], "fr")}
    initialContent={text("initialContent", "<p>Test</p>")}
    setContent={(e) => console.log(e)}
  />
);
