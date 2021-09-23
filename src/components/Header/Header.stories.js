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
    activated: true,
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
  token: "e987dcc6bc3f059d1ae69e80c85b90242a59e498",
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
  token: null,
};

const notifications = [
  {
    id: 5,
    appName: "SMS",
    titleEn: "Emailing Release Note 1.4",
    titleFr: "Notes de publication de la nouvelle version d’Emailing 1.4",
    titleNl: "Emailing Release Note 1.4",
    contentType: "TEXT",
    contentEn: "",
    contentFr:
      "Contenu <b>Notes de publication</b> de la nouvelle version d’Emailing",
    contentNl: "",
    type: "RELEASE",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    createdAt: "2021-05-18 17:31:48",
    expiredAt: null,
    updatedAt: "18/05/2021",
    isRead: false,
    introEn: "",
    introFr:
      "Contenu Notes de publication de la nouvelle version d’Emailing...",
    introNl: "",
  },
  {
    id: 4,
    appName: "SMS",
    titleEn:
      "The approver organization has changed, now you can define multiple approval groups to better manage the validation of your campaigns.",
    titleFr:
      "Nouvelle fonctionnalité : L’organisation des approbateurs a changé, maintenant vous pouvez définir plusieurs groupes d’approbation pour mieux gérer la validation de vos campagnes.",
    titleNl:
      "Nieuwe functionaliteit : de organisatie van de goedkeurders is gewijzigd, nu kunt u meerdere goedkeuringsgroepen instellen om uw campagnevalidatie beter te beheren.",
    contentType: "LINK",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    contentEn: null,
    contentFr: "https://blog.tamtam.pro/fr",
    contentNl: null,
    type: null,
    createdAt: "2021-04-26 08:54:36",
    expiredAt: null,
    updatedAt: "12/05/2021",
    isRead: false,
    introEn: "",
    introFr:
      "Contenu Notes de publication de la nouvelle version d’Emailing...",
    introNl: "",
  },
  {
    id: 2,
    appName: "SMS",
    titleEn:
      "Here is our new service e-Box, it will help you to find all the email you have received from your communities.",
    titleFr:
      "Découvrez e-Box la nouvelle fonctionnalité vous permettant d’accéder à votre boîte de réception et revoir tous les messages reçus de la part de vos communautés.",
    titleNl:
      "Ontdek e-Box de nieuwe functionaliteit waarmee je je inbox kunt openen en alle berichten kunt bekijken die je van je community's hebt ontvangen.",
    contentType: "TEXT",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    contentEn: null,
    contentFr: null,
    contentNl: null,
    type: null,
    createdAt: "2021-01-24 14:58:41",
    expiredAt: null,
    updatedAt: "14/05/2021",
    isRead: true,
    introEn: "",
    introFr:
      "Contenu Notes de publication de la nouvelle version d’Emailing...",
    introNl: "",
  },
];

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
    notifications={object("notifications", notifications)}
    allCommunitiesUrl={text("allCommunitiesUrl", "/fr/communities")}
    onSelectAllCommunities={() => console.log("Communities select all")}
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
    notifications={notifications}
    onSelectAllCommunities={() => console.log("Communities select all")}
  />
);
export const HeaderLoggedOut = () => (
  <Header
    app={object("app", App)}
    auth={text("auth", JSON.stringify(authLogout))}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    onLanguageChange={(langue) => alert(langue)}
  />
);

export const SubMenuHeader = () => (
  <div style={{ padding: "3rem" }}>
    <SubMenu
      lng={select("language", ["fr", "nl", "en"], "fr")}
      menu={object("menu", menu)}
      currentCommunity={object("currentCommunity", authLogin.navCommunity)}
    >
      <div style={{ padding: "3rem" }}>Content</div>
    </SubMenu>
  </div>
);
