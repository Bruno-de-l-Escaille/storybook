import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { CookieConsent } from "./CookieConsent";

export default {
  title: "CookieConsent",
  component: CookieConsent,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const APP_ENV = "local";
const random = Math.floor(Math.random() * 100) + 1;
export const Default = () => (
  <CookieConsent lng="fr" cookieName={`ttp_consent_${APP_ENV}_${random}`} />
);
