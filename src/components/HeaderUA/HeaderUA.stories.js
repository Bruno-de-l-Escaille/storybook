import React from "react";
import { HeaderUA } from "./HeaderUA";
import {
  withKnobs,
  text,
  object,
  boolean,
  select,
  array,
} from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

const App = {
  appName: "United Associates",
  appLogoUrl: "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/logo/ua.png",
  appUrl: "https://unitedassociates.be",
};

// const rightIcons = {
//   profile: {
//     activated: false,
//     url: "https://blog.tamtam.pro/fr",
//   },
// };
const rightIcons = {
  home: {
    activated: true,
    url: "https://blog.tamtam.pro/fr",
  },
  profile: {
    activated: true,
    url: "https://blog.tamtam.pro/fr",
  },
  ebox: {
    activated: true,
    url: "https://blog.tamtam.pro/fr",
  },
  search: {
    activated: false,
  },
  notifs: {
    activated: true,
  },
  apps: {
    activated: true,
  },
  faq: {
    activated: true,
  },
  backoffice: {
    activated: true,
    label: "Back office",
    url: "https://blog.tamtam.pro/fr",
    clicked: false,
  },
};

const settings = [
  {
    label: "Gérer les fiduciaires",
    url: "/manage-fiduciary",
  },
];

const authLogin = {
  token: "00882984434b82623e1831486530a29d44efffd9",
  loggedAs: "ADMIN",
  navCommunity: {
    id: 9,
    name: "Forum For The Future",
    abbreviation: "F.F.F.",
    avatarUrl:
      "https://s3.tamtam.pro/v2/storage/media/IMAGE/2174/AVATAR_a55cc7155830b08e45678b3bc4ed02f3e190fc96.png",
    appsState: [
      {
        code: "blog",
        name: { fr: "Blog", en: "Blog", nl: "Blog" },
        url: "https://blog.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/blog.png",
        activated: true,
      },
      {
        code: "media",
        name: { fr: "Media", en: "Media", nl: "Media" },
        url: "https://media.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/media.png",
        activated: true,
      },
      {
        code: "forum",
        name: { fr: "Forum", en: "Forum", nl: "Forum" },
        url: "https://forum.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/forum.png",
        activated: true,
      },
      {
        code: "emailing",
        name: { fr: "Emailing", en: "Emailing", nl: "Emailing" },
        url: "https://sending.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/emailing.png",
        activated: false,
      },
      {
        code: "ebox",
        name: { fr: "E-Box", en: "E-Box", nl: "E-Box" },
        url: "https://sending.rc2.tamtam.pro/e_box",
        icon: "https://s3.tamtam.pro/v2/apps/ebox.png",
        activated: true,
      },
      {
        code: "sms",
        name: { fr: "SMS", en: "SMS", nl: "SMS" },
        url: "https://sending.rc2.tamtam.pro/smsCampaigns",
        icon: "https://s3.tamtam.pro/v2/apps/sms.png",
        activated: false,
      },
      {
        code: "talk",
        name: { fr: "Talk", en: "Talk", nl: "Talk" },
        url: "https://talk.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/talk.png",
        activated: true,
      },
      {
        code: "data",
        name: { fr: "Accounting", en: "Accounting", nl: "Accounting" },
        url: "https://accounting.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/accounting.png",
        activated: true,
      },
      {
        code: "team",
        name: { fr: "Powerteam", en: "Powerteam", nl: "Powerteam" },
        url: "https://powerteam.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/prod/apps/powerteam.png",
        activated: true,
      },

      {
        code: "webtools",
        name: { fr: "Webtools", en: "Webtools", nl: "Webtools" },
        url: "https://webtool.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/webtools.png",
        activated: false,
      },
      {
        code: "survey",
        name: { fr: "Survey", en: "Survey", nl: "Survey" },
        url: "https://survey.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/survey.png",
        activated: true,
      },
      {
        code: "event",
        name: { fr: "Event", en: "Event", nl: "Event" },
        url: "https://event.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/event.png",
        activated: true,
      },
      {
        code: "payment",
        name: { fr: "Payment", en: "Payment", nl: "Payment" },
        url: "https://payment.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/payment.png",
        activated: true,
      },

      {
        code: "forumm",
        name: { fr: "Forum", en: "Forum", nl: "Forum" },
        url: "https://forum.rc2.tamtam.pro/",
        icon: "https://s3.tamtam.pro/v2/apps/forum.png",
        activated: true,
      },
    ],
  },
  user: {
    type: "ADMIN",
    id: 8650,
    firstName: "Emmanuel",
    lastName: "Degrève",
    mainEmail: "emmanuel.degreve@degandpartners.com",
    avatarUrl:
      "https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
    contactSocialNetworks: {
      facebook: {
        id: 568543643,
        username: "Emmanuel Degrève",
        publicProfileUrl: null,
      },
      linkedin: {
        id: "dnuRIWeubQ",
        username: "Emmanuel Degrève",
        publicProfileUrl: null,
      },
    },
    communities: [
      {
        id: 8,
        name:
          "Instituut van de Accountants en de Belastingconsulenten - Institut des Experts-comptables et des Conseils fiscaux",
        abbreviation: "IEC-IAB",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/2753/AVATAR_a726d59d13c723f15343ae75ead939fdd1f0895f.png",
      },
      {
        id: 9,
        name: "Forum For The Future",
        abbreviation: "F.F.F.",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/2174/AVATAR_a55cc7155830b08e45678b3bc4ed02f3e190fc96.png",
      },
      {
        id: 4,
        name: "DEG & PARTNERS CONSULTING COMPANY",
        abbreviation: "Deg & Partners",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/34/AVATAR_00e0170bb5fc8a8cae3fd79abdc36c943669673b.png",
      },
      {
        id: 8,
        name:
          "Instituut van de Accountants en de Belastingconsulenten - Institut des Experts-comptables et des Conseils fiscaux",
        abbreviation: "IEC-IAB",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/2753/AVATAR_a726d59d13c723f15343ae75ead939fdd1f0895f.png",
      },
      {
        id: 9,
        name: "Forum For The Future",
        abbreviation: "F.F.F.",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/2174/AVATAR_a55cc7155830b08e45678b3bc4ed02f3e190fc96.png",
      },
      {
        id: 4,
        name: "DEG & PARTNERS CONSULTING COMPANY",
        abbreviation: "Deg & Partners",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/34/AVATAR_00e0170bb5fc8a8cae3fd79abdc36c943669673b.png",
      },
    ],
  },
};

const authLogout = {
  navCommunity: null,
  user: null,
  token: null, // null or public token
};

export default {
  title: "HeaderUA",
  component: HeaderUA,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

const languages = ["fr", "nl", "en"];
const noLanguages = [];
const policy = [{ label: "TERMS OF USE", url: "/" }];

const privacy = [
  { label: "v 1.3 fr", url: "/" },
  { label: "another one", url: "/" },
  { label: "new rub test", url: "/" },
];

const cookies = [
  { label: "manage_cookies", url: "/" },
  { label: "cookie one", url: "/" },
  { label: "cookie two", url: "/" },
];
export const HeaderLoggedIn = () => (
  <HeaderUA
    app={object("app", App)}
    auth={object("auth", authLogin)}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    languages={array("languages", languages)}
    rightIcons={object("rightIcons", rightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    // onSelectAllCommunities={() => console.log("Communities select all")}
    onSelectCommunity={(community) => console.log("community click", community)}
    onFAQLoad={() => console.log("onFAQLoad", window.showFAQ)}
    firstList={privacy}
    secondList={cookies}
    thirdList={policy}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);

const portalSwitch = {
  items: [
    { key: "SETTINGS", label: "Configuration", url: "/" },
    { key: "COLLABORATOR", label: "Portail collaborateur", url: "/" },
    { key: "CLIENT", label: "Portail client", url: "/" },
    { key: "PUBLIC", label: "Portail publique", url: "/" },
  ],
  onChange: (e) => {
    console.log("change space", e);
  },
};
export const HeaderPortalSwitch = () => (
  <HeaderUA
    app={object("app", App)}
    auth={authLogin}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    languages={array("languages", languages)}
    rightIcons={object("rightIcons", rightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    portalSwitch={object("portalSwitch", portalSwitch)}
    currentPortal={text("currentPortal", "SETTINGS")}
    firstList={privacy}
    secondList={cookies}
    thirdList={policy}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);

export const HeaderLoggedOut = () => (
  <HeaderUA
    app={object("app", App)}
    auth={object("auth", authLogout)}
    env={text("env", "local")}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    languages={array("languages", languages)}
    onLanguageChange={(langue) => alert(langue)}
    signInUrl={text("signinUrl", "/login")}
    signUpUrl={text("signupUrl", "/register")}
  />
);
