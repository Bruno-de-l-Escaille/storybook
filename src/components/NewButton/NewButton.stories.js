import React from 'react';
import NewButton from './NewButton';
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: 'NewButton',
  component: NewButton,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
}

export const Share = () => <NewButton inProcess={boolean("inProcess", false)} disabled={boolean("disabled", false)} variant="share" onClick={() => alert("share")} children='Partager'/>
export const Cancel = () => <NewButton inProcess={boolean("inProcess", false)}  variant="cancel" onClick={() => alert("cancel")} children='Annuler'/>
export const Save = () => <NewButton inProcess={boolean("inProcess", false)} variant="save" disabled={boolean("disabled", false)} onClick={() => alert("save")} children='Enregistrer'/>
export const show_more = () => <NewButton inProcess={boolean("inProcess", false)} variant="showmore" onClick={() => alert("show more")} children='Voir plus'/>
export const register = () => <NewButton inProcess={boolean("inProcess", false)} variant="register" onClick={() => alert("register")} children="S'inscrire"/>