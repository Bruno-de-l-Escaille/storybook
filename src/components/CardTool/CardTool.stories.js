import React from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { CardTool } from "./CardTool";

export default {
  title: "CardTool",
  component: CardTool,
  decorators: [
    StoryRouter(),
    (story) => <div style={{ padding: "3rem" }}>{story()}</div>,
    withKnobs,
  ],
};

const data = {
  icon: "webtool-calculator",
  scopes: ["PUBLIC", "allCollaborators", "allClient"],
  created: "Créé le 02 août 2022, 10:55",
  title: "Inter haec Orfitus",
  link: "www.reportpaiementsonss.be/",
  description:
    "Exsistit autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi quando amici subdi qua autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi q",
  tag: "Juridique",
  organization: "Par Deg & Partners Consulting Company",
};
const dataFavorite = {
  icon: "webtool-user",
  scopes: ["PRIVATE"],
  created: "Créé le 02 août 2022, 10:55",
  title: "Inter haec Orfitus Inter haec hae Orfitus Inter haec Orfitus",
  link: "www.reportpaiementsonss.be/fr/Orfitus-Inter-haec-Orfitus",
  description:
    "Exsistit autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi quando amici subdi qua autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi q",
  tag: "Juridique",
  organization: "Par Deg & Partners Consulting Company",
};

export const CardToolDefault = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-5 large-3">
        <CardTool
          lng="fr"
          data={data}
          scope="collaborator"
          color={"#FFB340"}
          loadingActions={{ share: true }}
          allowedActions={{ favorite: true, share: true }}
          isFavorite={true}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
          setTooltipVisibility={() => console.log("setTooltipVisibility1")}
        />
      </div>
    </div>
  </div>
);

export const CardToolTransparent = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-5 large-3">
        <CardTool
          data={{ ...data, scopes: ["shared"] }}
          color={"#FFB340"}
          transparent
          isFavorite={boolean("isFavorite", false)}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
          setTooltipVisibility={() => console.log("setTooltipVisibility2")}
        />
      </div>
    </div>
  </div>
);

export const CardToolShared = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-5 large-3">
        <CardTool
          data={dataFavorite}
          color={"#4695DB"}
          displayTooltip
          toolContent={<span>Tooltip content</span>}
          isFavorite={boolean("isFavorite", true)}
          allowedActions={{ share: true, more: true, unshare: true }}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
          setTooltipVisibility={(val) =>
            console.log("setTooltipVisibility3", val)
          }
        />
      </div>
    </div>
  </div>
);
