export const user = {
  firstName: "Emmanuel",
  lastName: "Degrève",
  mainEmail: "emmanuel.degreve@degandpartners.com",
  avatarUrl:
    "https://s3.tamtam.pro/v2/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
};

export const contactSocialNetworks = {
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
};

export const settings = [
  {
    label: "APPROBATIONS",
    url: "/approvers-setting",
  },
  {
    label: "UTILISATEURS",
    url: "/settings",
  },
];

const APP_LOGOS_BASE_URL = "https://s3.tamtam.pro/v2/apps";
export const apps = [
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
    activated: true,
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
    activated: true,
  },
  {
    code: "talk",
    name: { fr: "Talk", en: "Talk", nl: "Talk" },
    url: "https://talk.rc2.tamtam.pro/",
    icon: "https://s3.tamtam.pro/v2/apps/talk.png",
    activated: false,
  },
  {
    code: "data",
    name: { fr: "Accounting", en: "Accounting", nl: "Accounting" },
    url: "https://accounting.rc2.tamtam.pro/",
    icon: "https://s3.tamtam.pro/v2/apps/accounting.png",
    activated: false,
  },
  {
    code: "team",
    name: { fr: "Powerteam", en: "Powerteam", nl: "Powerteam" },
    url: "https://powerteam.rc2.tamtam.pro/",
    icon: "https://s3.tamtam.pro/prod/apps/powerteam.png",
    activated: false,
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
    code: "directory",
    name: { fr: "Directory (HQ)", en: "Directory (HQ)", nl: "Directory (HQ)" },
    url: "https://rc2.tamtam.pro/folders",
    icon: "https://s3.tamtam.pro/v2/apps/directory.png",
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
    code: "portal",
    name: { fr: "Portal", en: "Portal", nl: "Portal" },
    url: "https://portal.rc2.tamtam.pro/",
    icon: "https://s3.tamtam.pro/v2/apps/portal.png",
    activated: true,
  },
];

export const rightLinks = {
  home: {
    activated: true,
    icon: "Portal",
    url: "",
  },
  profile: {
    activated: true,
    icon: "Profile",
    url: "https://uat2.tamtam.pro/profile",
  },
  ebox: {
    activated: true,
    icon: "Ebox",
    url: "https://uat2.emailing.tamtam.pro/e_box",
  },
  search: {
    activated: true,
    icon: "Search",
  },
};

export const notifications = [
  {
    id: 5,
    appName: "SMS",
    subjectEn: "Emailing Release Note 1.4",
    subjectFr: "Notes de publication de la nouvelle version d’Emailing 1.4",
    subjectNl: "Emailing Release Note 1.4",
    contentEn: "",
    contentFr: "",
    contentNl: "",
    type: "RELEASE",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    createdAt: "2018-10-29 17:31:48",
    expiredAt: null,
    updatedAt: "14/11/2019",
    status: "UNREAD",
  },
  {
    id: 4,
    appName: "SMS",
    subjectEn:
      "The approver organization has changed, now you can define multiple approval groups to better manage the validation of your campaigns.",
    subjectFr:
      "Nouvelle fonctionnalité : L’organisation des approbateurs a changé, maintenant vous pouvez définir plusieurs groupes d’approbation pour mieux gérer la validation de vos campagnes.",
    subjectNl:
      "Nieuwe functionaliteit : de organisatie van de goedkeurders is gewijzigd, nu kunt u meerdere goedkeuringsgroepen instellen om uw campagnevalidatie beter te beheren.",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    contentEn: null,
    contentFr: null,
    contentNl: null,
    type: null,
    createdAt: "2018-10-26 08:54:36",
    expiredAt: null,
    updatedAt: "14/11/2019",
    status: "READ",
  },
  {
    id: 2,
    appName: "SMS",
    subjectEn:
      "Here is our new service e-Box, it will help you to find all the email you have received from your communities.",
    subjectFr:
      "Découvrez e-Box la nouvelle fonctionnalité vous permettant d’accéder à votre boîte de réception et revoir tous les messages reçus de la part de vos communautés.",
    subjectNl:
      "Ontdek e-Box de nieuwe functionaliteit waarmee je je inbox kunt openen en alle berichten kunt bekijken die je van je community's hebt ontvangen.",
    isPersonal: 0,
    isAuto: 0,
    targetsCounts: 0,
    targetsListCreated: false,
    contentEn: null,
    contentFr: null,
    contentNl: null,
    type: null,
    createdAt: "2018-10-24 14:58:41",
    expiredAt: null,
    updatedAt: "14/11/2019",
    status: "READ",
  },
];

export const communities = [
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
];
