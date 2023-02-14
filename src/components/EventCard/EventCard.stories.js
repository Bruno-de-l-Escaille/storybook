import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { EventCard } from "./EventCard";
import events from "./data.json";

export default {
  title: "EventCard",
  component: EventCard,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-3">
        <EventCard
          language="fr"
          isSelected={false}
          event={events[0]}
          index={1}
          eventUrl={"https://event-pro.rc2.tamtam.pro/"}
          isFetching={boolean("isFetching", false)}
        />
      </div>
    </div>
  </div>
);

export const Expert = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-4 large-3">
        <EventCard
          language="fr"
          event={events[0]}
          index={1}
          eventUrl={"https://event-pro.rc2.tamtam.pro/"}
          isFetching={boolean("isFetching", false)}
          expert={true}
        />
      </div>
    </div>
  </div>
);
