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

const data = [
  {
    id: 5,
    order: 1,
    showInFooter: true,
    versions: [
      {
        id: 12,
        name: "1.3",
        titleFr: "v 1.3 fr",
        titleEn: "v 1.3 en",
        titleNl: "v 1.3 nl",
        status: "PUBLISHED",
        introductionFr: "v 1.3 fr",
        introductionEn: "<p>v 1.3 en<br></p>",
        introductionNl: "<p>v 1.3 nl<br></p>",
        publishedAt: "2022-09-09 16:55:38",
      },
      {
        id: 11,
        name: "1.2",
        titleFr: "azazd",
        titleEn: "",
        titleNl: "",
        status: "DRAFT",
        introductionFr: "dada",
        introductionEn: "",
        introductionNl: "",
      },
      {
        id: 7,
        name: "1.1",
        titleFr: "test",
        titleEn: "test",
        titleNl: "test",
        status: "PUBLISHED",
        introductionFr: "test",
        introductionEn: "test",
        introductionNl: "test",
        publishedAt: "2022-09-09 11:25:26",
      },
      {
        id: 6,
        name: "1.0",
        titleFr: "test",
        titleEn: "test",
        titleNl: "test",
        status: "DRAFT",
        introductionFr: "test",
        introductionEn: "test",
        introductionNl: "test",
      },
    ],
  },
  {
    id: 7,
    order: 2,
    showInFooter: false,
    versions: [
      {
        id: 14,
        name: "1.0",
        titleFr: "another one",
        titleEn: "",
        titleNl: "",
        status: "DRAFT",
        introductionFr: "another one",
        introductionEn: "",
        introductionNl: "",
      },
    ],
  },
  {
    id: 6,
    order: 3,
    showInFooter: false,
    versions: [
      {
        id: 13,
        name: "1.0",
        titleFr: "new rub test",
        titleEn: "",
        titleNl: "",
        status: "PUBLISHED",
        introductionFr: "new rub test",
        introductionEn: "",
        introductionNl: "",
        publishedAt: "2022-09-11 11:56:08",
      },
    ],
  },
];

const portalSwitch = [
  { key: "COLLABORATOR", label: "Portail collaborateur", url: "/collaborator" },
  { key: "CLIENT", label: "Portail client", url: "/client" },
  { key: "PUBLIC", label: "Portail publique", url: "/public" },
  { key: "SETTINGS", label: "Configuration", url: "/settings" },
];

export const Basic = () => (
  <FooterUA
    auth={auth}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    data={data}
    portalSwitch={portalSwitch}
    navigateTo={(value, type) => {
      console.log(value, type);
    }}
  />
);
