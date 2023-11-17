import React from "react";

import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import Tag from "./Tag";

export default {
  title: "Tag",
  component: Tag,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const Basic = () => {
  return (
    <Tag
      lng={"fr"}
      token={"0d742d308b297fbe1f356debd76b2bb815c14c92"}
      tags={[
        {
          label: "Attestation d'informations",
          name: "Attestation d'informations",
          value: 1463,
          tag: {
            id: 1463,
            nameEn: "Information certificate",
            nameFr: "Attestation d'informations",
            nameNl: "Informatie attestering",
            isSuperTag: false,
            superTag: null,
          },
          color: "#fed493",
        },
      ]}
      allowCreateTags={true}
      loadingTags={false}
      limitSuperTag={1}
      appEnv={"local"}
      onChange={(val) => console.log(val)}
      apiUrl={"http://local.api.tamtam.pro"}
    />
  );
};
