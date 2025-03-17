import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { FocusForm } from "./FocusForm";

export default {
  title: "FocusForm",
  component: FocusForm,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <FocusForm
    setShowFocusConfig={action("setShowFocusConfig")}
    eventId={null}
    cycleId={null}
    language="fr"
    token="231f67ec6bc68df3bd1cf8d2e53a3ac394f1774f"
    env="production"
    focusConfig={null}
  />
);
