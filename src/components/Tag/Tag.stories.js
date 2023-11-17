import React, { useState } from "react";

import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import Tag from "./Tag";

export default {
  title: "Tag",
  component: Tag,
  decorators: [StoryRouter(), (story) => <div>{story()}</div>, withKnobs],
};

export const Basic = () => {
  const [tags, setTags] = useState([]);
  return (
    <Tag
      lng={"fr"}
      token={"fc11dbe508b7af7f082b86c4f1bab9cd868e34bf"}
      tags={tags}
      allowCreateTags={true}
      loadingTags={false}
      limitSuperTag={1}
      appEnv={"staging"}
      onChange={(val) => setTags(val)}
      apiUrl={"https://api.staging.tamtam.pro"}
    />
  );
};
