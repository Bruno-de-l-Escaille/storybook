import React from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

import { CardTool } from "./CardTool";
import IconInsurance from "../Icons/IconInsurance";

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
  scoop: "public",
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
  scoop: "private",
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
          color={"#FFB340"}
          toolOptions={[
            { value: "public", label: "public" },
            { value: "collaborator", label: "collaborateur" },
            { value: "client", label: "client" },
            { value: "private", label: "privé" },
          ]}
          loadingActions={{ favorite: true, share: true }}
          allowedActions={{ favorite: true }}
          isFavorite={boolean("isFavorite", false)}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
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
          data={{ ...data, scoop: "shared" }}
          color={"#FFB340"}
          transparent
          isFavorite={boolean("isFavorite", false)}
          allowedActions={{ favorite: true }}
          loadingActions={{ favorite: false, share: false }}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
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
          allowedActions={{ favorite: false, more: true, unshare: true }}
          loadingActions={{ favorite: false, share: false }}
          data={dataFavorite}
          color={"#4695DB"}
          isFavorite={boolean("isFavorite", true)}
          onReach={() => console.log("handleReachCard")}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
        />
      </div>
    </div>
  </div>
);
