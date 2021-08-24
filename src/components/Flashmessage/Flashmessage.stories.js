import React, {useState} from 'react';
import {Flashmessage , Taost} from './Flashmessage';
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: 'FlashMessage',
  component: Flashmessage,
  decorators: [
    StoryRouter(),
    (story) => <div>{story()}</div>,
    withKnobs,
  ],
}


export const Success = () => 
<div>
<Flashmessage openFlash={true}  message="message success" status="SUCCESS" title="success" time={30000}/>
<button onClick={()=>Taost("error")}>ok</button>
</div>

export const Error = () => 
<div>
<Flashmessage openFlash={true}  message="message Error" status="ERROR" title="error" time={30000}/>
<button onClick={()=>Taost("error")}>ok</button>
</div>

export const Warning = () => {
const [open, setOpen] = useState(true);
return(
  <div>
<Flashmessage openFlash={open}  message="message warning" status="WARNING" title="warning" time={30000}/>
<button onClick={()=>setOpen(false)}>ok</button>
</div>
);
}


