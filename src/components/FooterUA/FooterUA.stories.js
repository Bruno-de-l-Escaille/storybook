import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import FooterUA from "./FooterUA";

export default {
  title: "FooterUA",
  component: FooterUA,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

const auth = {
  token: "00882984434b82623e1831486530a29d44efffd9",
  loggedAs: "ADMIN",
  navCommunity: {
    id: 9,
    name: "Forum For The Future",
    abbreviation: "F.F.F.",
    avatarUrl:
      "https://s3.tamtam.pro/v2/storage/media/IMAGE/2174/AVATAR_a55cc7155830b08e45678b3bc4ed02f3e190fc96.png",
  },
  user: {
    type: "ADMIN",
    id: 8650,
    firstName: "Emmanuel",
    lastName: "Degrève",
    mainEmail: "emmanuel.degreve@degandpartners.com",
    isUaAdmin: true,
    avatarUrl:
      "https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
  },
};

const policy = [
  { label: "terms_of_use", url: "/" },
  { label: "privacy_policy", url: "/" },
];

const data = [
  { label: "v 1.3 fr", url: "/privacy?rub=5" },
  { label: "another one", url: "/privacy?rub=7" },
  { label: "new rub test", url: "/privacy?rub=6" },
];

const portalSwitch = [
  { label: "Portail collaborateur", url: "/collaborator" },
  { label: "Portail client", url: "/client" },
  { label: "Portail publique", url: "/public" },
  { label: "Configuration", url: "/settings" },
];

export const Basic = () => (
  <FooterUA
    primaryLogo={
      "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/logo/ua.png"
    }
    secondaryLogo={auth.navCommunity.avatarUrl}
    firstList={portalSwitch}
    secondList={policy}
    thirdList={data}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);
