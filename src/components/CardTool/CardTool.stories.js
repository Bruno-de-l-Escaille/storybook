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
  title: "Inter haec Orfitus",
  link: "www.reportpaiementsonss.be",
  description: "Exsistit autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi quando amici subdi qua autem hoc loco quaedam quaestio subdifficilis, numt antep uaestio subdi q",
  tag: "Juridique",
  organization: "DEG&PARTNERS"
};

export const CardToolDefault = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-5 large-3">
        <CardTool
          data={data}
          color={"#FFB340"}
          isFavorite={boolean("isFavorite", false)}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
        />
      </div>
    </div>
  </div>
);


export const CardToolFavorite = () => (
  <div className="grid-container">
    <div className="grid-x">
      <div className="cell small-12 medium-5 large-3">
        <CardTool
          data={data}
          color={"#4695DB"}
          isFavorite={boolean("isFavorite", true)}
          onShare={() => console.log("handleShareCard")}
          onDelete={() => console.log("handleDeleteCard")}
          onUpdate={() => console.log("handleUpdateCard")}
          onAddFavorite={() => console.log("handleAddFavoritCard")}
        />
      </div>
    </div>
  </div>
);
