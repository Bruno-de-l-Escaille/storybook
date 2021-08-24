import React from 'react';
import Button from './Button';
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: 'Button',
  component: Button,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
}

export const Primary = () => <Button inProcess={boolean("inProcess", true)} variant="primary" children='Primary'/>
export const Secondary= () => <Button inProcess={boolean("inProcess", false)} variant="secondary" children='Secondary'/>
export const Danger= () => <Button inProcess={boolean("inProcess", false)} variant="danger" children='Danger'/>
export const Success = () => <Button inProcess={boolean("inProcess", false)} variant="success" children='Success'/>