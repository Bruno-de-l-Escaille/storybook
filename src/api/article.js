import axios from "axios";

export const getArticle = ({ apiUrl, token, articleId }) => {
  const filter = [
    { property: "id", value: articleId, operator: "eq" },
    {
      property: "status",
      value: ["DRAFT", "READY", "SCHEDULED", "PUBLISHED", "PROGRAMMED"],
      operator: "in",
    },
  ];

  const fields = [
    "*",
    "content",
    "introduction",
    "author",
    "contactEmail",
    "contactSocialNetworks",
    "main_media",
    "tags",
    "category",
    "organization",
    "media_articles",
    "theme",
    "type",
    "social",
    "image_cropped",
    "contentState",
    "comment",
    "url",
    "isSharedInWorkflow",
    "chains",
    "pages",
    "relatedArticles",
  ];

  const requestUrl = `${apiUrl}/blog/article`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const uploadMedia = ({ apiUrl, token, data }) => {
  const requestUrl = `${apiUrl}/media/media/upload-media`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("file", data);

  return axios.post(requestUrl, formData, {
    Warning: "413",
  });
};
