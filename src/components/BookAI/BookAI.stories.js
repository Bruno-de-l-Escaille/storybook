import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { number, object, select, text } from "@storybook/addon-knobs";
import { BookAIList } from "./BookAIList";

const queryClient = new QueryClient();

// const user = {
//   type: "ADMIN",
//   id: 8650,
//   firstName: "Emmanuel",
//   lastName: "Degrève",
//   mainEmail: "emmanuel.degreve@degandpartners.com",
//   avatarUrl:
//     "https://s3.tamtam.pro/production/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
//   language: "fr",
//   mainPhone: "+32486210211",
// };

const user = {
  uid: "70FF3651-066C-4F9E-B1F2-0DA285DB5B0F",
  enabled: true,
  firstName: "Bruno",
  lastName: "de lescaille",
  language: "fr",
  type: "ADMIN",
  status: "CREATED",
  institute: "",
  numeroAgreation: "",
  agreationType: "",
  agreationTitle: "",
  agreationParam: "",
  itaaStatus: "",
  agreation: [],
  gender: "MALE",
  title: "",
  salutation: "",
  function: "BigBoss",
  isSecure: true,
  hasAgreedTerms: true,
  isUaAdmin: true,
  uaStatus: "VALIDATED",
  acceptCookies: true,
  id: 8863,
  mainEmail: "bruno.delescaille@gmail.com",
  mainPhone: "+32487324449",
};

export default {
  title: "BookAIList",
  component: BookAIList,
  decorators: [(Story) => <Story />],
};

export const Default = () => (
  <BookAIList
    language={select("language", ["fr", "nl", "en"], "fr")}
    organization={number("organization", 4442)}
    token={text("token", "91bd6d1fec3d1ebe77ae1407159a4440fe4b7e16")}
    user={object("user", user)}
    showFiduciareModal={false}
    env={text("env", "staging")}
  />
);
