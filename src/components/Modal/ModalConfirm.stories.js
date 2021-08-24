import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { ModalConfirm } from "./ModalConfirm";

export default {
  title: "ModalConfirm",
  component: ModalConfirm,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Delete = () => (
  <ModalConfirm
    type={select("type", ["delete", "publish", "send"], "delete")}
    isOpen={boolean("isOpen", true)}
    onCancel={() => console.log("cancel")}
    onConfirm={() => console.log("handleDeleteTree")}
    inProcess={boolean("inProcess", false)}
    actionFailed={boolean("actionFailed", false)}
    title={text("title", "Confirmation de suppression")}
    text={text("text", "Êtes-vous sûr de bien vouloir supprimer cet élément ?")}
    labelNo={text("labelNo", "No")}
    labelYes={text("lableYes", "Yes")}
    labelError={text("labelError", "Error")}
  />
);

export const Publish = () => (
  <ModalConfirm
    type="publish"
    isOpen={true}
    onCancel={() => console.log("cancel")}
    onConfirm={() => console.log("handleOnConfirm")}
    inProcess={false}
    actionFailed={false}
    title="Confirmation de publication"
    text="Voulez-vous vraiment publié cet article dans Blog ? "
    labelNo="No"
    labelYes="Yes"
    labelError="Error"
  />
);

export const Send = () => (
  <ModalConfirm
    type="send"
    isOpen={true}
    onCancel={() => console.log("cancel")}
    onConfirm={() => console.log("handleDeleteTree")}
    inProcess={false}
    actionFailed={false}
    title="Confirmation de l’envoie"
    text="Voulez-vous vraiment envoyer cet article ?"
    labelNo="No"
    labelYes="Yes"
    labelError="Error"
  />
);
