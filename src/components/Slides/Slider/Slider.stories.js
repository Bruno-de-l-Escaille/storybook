import React from "react";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { Slider } from "./Slider";
import { Default as ArticleSlide } from "../ArticleSlide/ArticleSlide.stories";
import { Default as EventSlide } from "../EventSlide/EventSlide.stories";
import { Default as MembershipSlide } from "../MembershipSlide/MembershipSlide.stories";
import { Default as PremiumSlide } from "../PremiumSlide/PremiumSlide.stories";
import { Type1 as CycleSlide } from "../CycleSlide/CycleSlide.stories";
import { Type2 as EssentialSlide } from "../CycleSlide/CycleSlide.stories";
import { Type3 as SeasonSlide } from "../CycleSlide/CycleSlide.stories";

export default {
  title: "Slides/Slider",
  component: Slider,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const Default = () => (
  <Slider
    cards={[
      <ArticleSlide />,
      <EventSlide />,
      <MembershipSlide />,
      <PremiumSlide />,
      <CycleSlide />,
      <EssentialSlide />,
      <SeasonSlide />,
    ]}
    autoPlay={boolean("autoPlay", true)}
  />
);
