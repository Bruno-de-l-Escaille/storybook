import React from 'react';
import { withKnobs} from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { FlashMessage, Toast} from './ToastContainer';

export default {
  title: 'ToastContanier',
  component: FlashMessage,
  decorators: [
    StoryRouter(),
    (story) => <div>{story()}</div>,
    withKnobs,
  ],
}

export const Error = () => <div> <FlashMessage/> <button onClick={()=>Toast.error('message data error')}>ok</button></div>
export const Success = () => <div> <FlashMessage/> <button onClick={()=>Toast.success("message data saved ")}>ok</button></div>
export const Warning = () => <div> <FlashMessage/> <button onClick={()=>Toast.warning("message data warning")}>ok</button></div>
