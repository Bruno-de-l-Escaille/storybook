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

const authLogin = {
  token: "00882984434b82623e1831486530a29d44efffd9",
  loggedAs: "ADMIN",
  user: {
    type: "ADMIN",
    id: 8650,
    firstName: "Emmanuel",
    lastName: "Degrève",
    mainEmail: "emmanuel.degreve@degandpartners.com",
    avatarUrl:
      "https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
  },
};

export default {
  title: "TTPEditor",
  component: TTPEditor,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const Default = () => (
  <TTPEditor
    auth={object("auth", authLogin)}
    env={text("env", "local")}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    initialContent={text("initialContent", "<p>Test</p>")}
    setContent={(e) => console.log(e)}
  />
);
