import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { EventCreationPopup } from "./EventCreationPopup";

export default {
  title: "EventCreationPopup",
  component: EventCreationPopup,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => <EventCreationPopup isOpen={true} language="fr" />;
