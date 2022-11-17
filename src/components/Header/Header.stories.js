import React from "react";
import { Header } from "./Header";
import { SubMenu } from "./SubMenu";
import {
  withKnobs,
  text,
  object,
  boolean,
  select,
} from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

const App = {
  appName: "Blog",
  appLogoUrl: "https://s3.tamtam.pro/v2/apps/blog.png",
  appUrl: "https://blog.tamtam.pro/fr",
  homeUrl: "https://one.tamtam.pro",
  isPrivateBlog: false,
  currentEvent: null,
  withAuthLogin: false,
};

const AppPrivate = {
  appName: "Blog",
  appLogoUrl: "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/logo/deg.png",
  appUrl: "https://blog.tamtam.pro/fr",
  homeUrl: "https://one.tamtam.pro",
  isPrivateBlog: true,
};

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

const portalRightIcons = {
  home: {
    activated: false,
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
    activated: true,
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
    activated: false,
    label: "Back office",
    url: "https://blog.tamtam.pro/fr",
  },
};

const settings = [
  {
    label: "utilisateur",
    url: "https://blog.rc2.tamtam.pro/",
  },
  {
    label: "data",
    url: "https://accounting.rc2.tamtam.pro/",
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

const menu = [
  {
    title: "Acceuil",
    url: `/fr`,
    iconUrl:
      "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/icon/header/home.svg",
    community: false,
  },
  {
    title: "mes articles",
    url: `/articles/my_articles`,
    iconUrl:
      "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/icon/header/articles.svg",
    community: false,
  },
  {
    title: "auteurs",
    iconUrl:
      "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/icon/header/authors.svg",
    submenu: "AUTEURS",
    community: false,
    submenu: [
      {
        title: "Emmanuel DEGREVE",
        avatarUrl:
          "https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
        url: `/authors`,
      },
      {
        title: "Stéphane De Bremaeker",
        avatarUrl:
          "https://s3.tamtam.pro/prod/storage/media/IMAGE/1975/AVATAR_89452b9bf04fee0471086bb171ea8357a42eec9a.png",
        url: `/authors`,
      },
    ],
    more: {
      title: "follow_others",
      url: `/authors`,
    },
  },
  {
    title: "library",
    url: `/library`,
    iconUrl:
      "https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/icon/header/categories.svg",
    community: true,
    className: "hide-for-small-only",
  },
];

const policy = [{ label: "terms_of_use", url: "/" }];

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

export default {
  title: "Header",
  component: Header,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const HeaderLoggedIn = () => (
  <Header
    app={object("app", App)}
    auth={object("auth", authLogin)}
    auth={authLogin}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    rightIcons={object("rightIcons", rightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    // onSelectAllCommunities={() => console.log("Communities select all")}
    onSelectCommunity={(community) => console.log("community click", community)}
    onBackOfficeClick={(activate) =>
      console.log("backOffice click : " + activate)
    }
    onFAQLoad={() => console.log("onFAQLoad", window.showFAQ)}
    firstList={privacy}
    secondList={cookies}
    thirdList={policy}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);
export const HeaderPrivateBlogLoggedIn = () => (
  <Header
    app={object("app", AppPrivate)}
    auth={object("auth", authLogin)}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    rightIcons={object("rightIcons", rightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    onSelectAllCommunities={() => console.log("Communities select all")}
    firstList={privacy}
    secondList={cookies}
    thirdList={policy}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);

const switchSpace = {
  items: [
    { key: "COMMUNITY", label: "Community" },
    { key: "WORK", label: "Work place" },
  ],
  current: "WORK",
  onChange: (e) => {
    console.log("change space", e);
  },
};
export const HeaderSpaceLoggedIn = () => (
  <Header
    app={object("app", App)}
    auth={object("auth", authLogin)}
    auth={authLogin}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    rightIcons={object("rightIcons", portalRightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    // onSelectAllCommunities={() => console.log("Communities select all")}
    switchSpace={object("switchSpace", switchSpace)}
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
  <Header
    app={object("app", App)}
    auth={authLogin}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    rightIcons={object("rightIcons", portalRightIcons)}
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

const heabderButtonRightIcons = {
  ...rightIcons,
  backoffice: {
    activated: false,
  },
  buttonLink: {
    activated: true,
    label: "Event",
    url: "https://blog.tamtam.pro/fr",
    icon: "https://event-pro.tamtam.pro/img/logo-event.png",
  },
};
export const HeaderButton = () => (
  <Header
    app={object("app", App)}
    auth={authLogin}
    env={text("env", "local")}
    settings={object("settings", settings)}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    rightIcons={object("rightIcons", heabderButtonRightIcons)}
    onLanguageChange={(langue) => alert(langue)}
    onLogoutClick={(e) => console.log("Logout", e)}
    onSearchClick={() => alert("searching")}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    firstList={privacy}
    secondList={cookies}
    thirdList={policy}
    navigateTo={(url) => {
      console.log(url);
    }}
  />
);

export const HeaderLoggedOut = () => (
  <Header
    app={object("app", App)}
    auth={object("auth", authLogout)}
    env={text("env", "local")}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    onLanguageChange={(langue) => alert(langue)}
  />
);

export const HeaderLoggedOutIntendedApp = () => (
  <Header
    app={object("app", App)}
    auth={object("auth", authLogout)}
    env={text("env", "local")}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    onLanguageChange={(langue) => alert(langue)}
    intendedApp={text("intendedApp", "offfcourse*")}
  />
);

export const SubMenuHeader = () => (
  <div style={{ padding: "3rem" }}>
    <SubMenu
      lng={select("language", ["fr", "nl", "en"], "fr")}
      menu={object("menu", menu)}
      currentCommunity={object("currentCommunity", authLogin.navCommunity)}
      hideVertical={boolean("hideVertical", false)}
    >
      <div style={{ padding: "3rem" }}>Content</div>
    </SubMenu>
  </div>
);
