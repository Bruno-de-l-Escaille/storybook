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
  firstName: "Yassine",
  lastName: "El Bekkali",
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
  id: 471421,
  mainEmail: "yassine.elbekkali21@gmail.com",
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
    token={text("token", "db78fd047032fa01962b51f4bf6f008a5e561d5e")}
    user={object("user", user)}
    env={text("env", "staging")}
  />
);
