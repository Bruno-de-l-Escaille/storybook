import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { Avatar } from "./Avatar";

export default {
  title: "Avatar",
  component: Avatar,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Basic = () => (
  <Avatar avatarUrl="https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png" showInfo={false} />
);

export const WithoutPicture = () => (
  <Avatar 
    showInfo={false}
    firstName="Emmanuel"
    lastName="Degrève"
  />
);

export const WithName = () => (
  <Avatar
    avatarUrl="https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png"
    firstName="Emmanuel"
    lastName="Degrève"
  />
);

export const WithInfo = () => (
  <Avatar
    avatarUrl="https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png"
    firstName="Emmanuel"
    lastName="Degrève"
    avatarSignature="Partner et Conseil Fiscal"
  />
);
