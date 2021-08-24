import React from 'react';
import Switch from './Switch';
import DisabledSwitch from './DisabledSwitch';
import MultiSwitch from './MultiSwitch';
import MultiSwitchAll from './MultiSwitchAll';
import MultiSwitchCheckbox from "./MultiSwitchCheckbox"
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";


export default {
  title: 'Switch',
  component: Switch,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
}

let lng = ['Anglais', 'Français', 'Néerlandais'];
let labels = ['label1', 'label2', 'label3'];
let medias = ['Image', 'Vidéo', 'Documents'];
let status=['Draft', 'Ready', 'Published'];
let vals = ['val1', 'val2' , 'val3'];
let isChecked = [false, false , false];

export const Default = () =>{ return <Switch name="switch" onChange={(status)=>console.log(status)} isDark={boolean("isDark", false)}/>};

export const Disabled = () =>{return <DisabledSwitch name="disabledswitch" isChecked={boolean("isChecked", false)} isDark={boolean("isDark", false)} />};

export const MultiRadio= () =>  (<MultiSwitch
          title="Langues Autorisés"
          name="multiswitch"
          labels={lng}
          vals={vals}
          selectedValue={vals[2]}
          afterChange={(status)=>console.log(status)}
          isHorizontal={boolean("isHorizontal", false)}
          isDark={boolean("isDark", false)}
          />)  ;

export const MultiCheckbox= () =>  (
          <MultiSwitchCheckbox
          title="Status"
          name="multiswitch"
          labels={status}
          vals={vals}
          isChecked={isChecked}
          onChange={(status)=>console.log(status)}
          isDark={boolean("isDark", false)}
          />)  ;

 export const MultiAll = () =>  (<MultiSwitchAll
          title="Type de média autorisé"
          name="multiswitch"
          labels={medias}
          vals={vals}
          onChange={(status)=>console.log(status)}
          isChecked={isChecked}
          isDark={boolean("isDark", false)}
          />)  ;
