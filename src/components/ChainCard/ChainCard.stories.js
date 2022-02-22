import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { ChainCard } from "./ChainCard";
import avatars from "./data.json";

export default {
  title: "ChainCard",
  component: ChainCard,
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
        <ChainCard
          theme="light"
          lng="fr"
          isSelected={false}
          user={avatars[0]}
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
        <ChainCard
          theme="light"
          lng="fr"
          showAvatarEdit={true}
          onAvatarClick={action("onAvatarClick")}
          user={avatars[0]}
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
          <ChainCard
            lng="fr"
            theme="dark"
            user={avatars[0]}
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
          <ChainCard
            theme="dark"
            lng="fr"
            showAvatarEdit={true}
            onAvatarClick={action("onAvatarClick")}
            user={avatars[0]}
            isFetching={boolean("isFetching", false)}
          />
        </div>
      </div>
    </div>
  </div>
);
