import React from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { PopupConfirm } from "./PopupConfirm";

export default {
  title: "PopupConfirm",
  component: PopupConfirm,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};
const period = "";

export const Lock = () => (
  <PopupConfirm
    type="lock"
    isOpen={boolean("isOpen", true)}
    onCancel={() => console.log("cancel")}
    onConfirm={() => console.log("handleLock")}
    inProcess={boolean("inProcess", false)}
    actionFailed={boolean("actionFailed", false)}
    text="Voulez-vous vraiment verrouiller cette période "
    labelNo="Non, annuler"
    labelYes="Oui, verrouiller"
    labelError="Error"
    period={period}
  />
);

export const Unlock = () => (
  <PopupConfirm
    type="unlock"
    isOpen={true}
    onCancel={() => console.log("cancel")}
    onConfirm={() => console.log("handleUnlock")}
    inProcess={false}
    actionFailed={false}
    text="Voulez-vous vraiment déverrouiller cette période "
    labelNo="Non, annuler"
    labelYes="Oui, déverrouiller"
    labelError="Error"
    period={period}
  />
);
