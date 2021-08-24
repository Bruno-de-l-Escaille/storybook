import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  withKnobs,
  text,
  boolean,
  number,
  select,
  object,
  array,
} from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { Header } from "./Header";
import {
  user,
  contactSocialNetworks,
  communities,
  settings,
  apps,
  notifications,
  rightLinks,
} from "./Header.data";

export default {
  title: "OldHeader",
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

export const LoggedInHeader = () => (
  <Header
    loggedIn={true}
    loggedAs="MEMBER"
    lng={select("lng", ["fr", "nl", "en"], "fr")}
    appName="Blog"
    appLogoUrl="https://s3.tamtam.pro/v2/apps/blog.png"
    rightLinks={object("rightLinks", rightLinks)}
    user={object("user", user)}
    contactSocialNetworks={object(
      "contactSocialNetworks",
      contactSocialNetworks
    )}
    communities={object("communities", communities)}
    currentCommunity={communities[0]}
    onCommunityChange={action("onCommunityChange")}
    onSearchClick={action("onSearchClick")}
    settings={object("settings", settings)}
    apps={object("apps", apps)}
    notifications={object("notifications", notifications)}
    onSearchClick={action("onSearchClick")}
    onLanguageChange={action("onLanguageChange")}
    onLogout={action("onLogout")}
  />
);

export const LoggedOutHeader = () => (
  <Header
    loggedIn={false}
    lng={select("language", ["fr", "nl", "en"], "fr")}
    appName="E-mailing"
    appLogoUrl="https://s3.tamtam.pro/v2/apps/emailing.png"
    onLanguageChange={action("onLanguageChange")}
  />
);
