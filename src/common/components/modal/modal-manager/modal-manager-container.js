import React from "react";
import { withSuspense } from "../../hocs/with-suspense";
import ModalManager from "./modal-manager";

function ModalManagerContainer() {
  console.log("ModalManagerContainer rendered");
  return <ModalManager />;
}

export default withSuspense(ModalManagerContainer);
