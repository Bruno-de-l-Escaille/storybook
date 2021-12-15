import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { UserCard } from "./UserCard";

import jsonData from "./data.json";
// import user from "./user.json";

const users = jsonData.data;

export default {
  title: "UserCard",
  component: UserCard,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Light = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-3">
        <UserCard
          theme="light"
          user={users[Math.floor(Math.random() * 10)]}
          isFetching={boolean("isFetching", false)}
        />
      </div>
    </div>
  </div>
);

export const LightEdit = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-3">
        <UserCard
          theme="light"
          showAvatarEdit={true}
          onAvatarClick={action("onAvatarClick")}
          user={users[Math.floor(Math.random() * 10)]}
          isFetching={boolean("isFetching", false)}
        />
      </div>
    </div>
  </div>
);

export const Dark = () => (
  <div style={{ background: "#29394d", padding: "3rem" }}>
    <div className="grid-container">
      <div className="grid-x">
        <div className="cell small-12 medium-4 large-3">
          <UserCard
            theme="dark"
            user={users[Math.floor(Math.random() * 10)]}
            isFetching={boolean("isFetching", false)}
          />
        </div>
      </div>
    </div>
  </div>
);

export const DarkEdit = () => (
  <div style={{ background: "#29394d", padding: "3rem" }}>
    <div className="grid-container">
      <div className="grid-x">
        <div className="cell small-12 medium-4 large-3">
          <UserCard
            theme="dark"
            showAvatarEdit={true}
            onAvatarClick={action("onAvatarClick")}
            user={users[Math.floor(Math.random() * 10)]}
            isFetching={boolean("isFetching", false)}
          />
        </div>
      </div>
    </div>
  </div>
);
