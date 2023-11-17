import axios from "axios";
import {
  generateCancellationTokenSource,
  getRequestCancellationToken,
  getRequestConfig,
  throwCatchedError,
} from "../utils";

let getTagsCTS;

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

export const getTags = ({
  token,
  language = null,
  customFilter = null,
  apiUrl,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getTagsCTS,
    cancellationTokenSource
  );
  getTagsCTS = cancellationTokenSource;

  const requestUrl = `${apiUrl}/blog/tag`;
  let filter = [];

  if (customFilter !== null) {
    if (Array.isArray(customFilter)) {
      filter.push(...customFilter);
    } else {
      filter.push(customFilter);
    }
  }

  let params = {
    access_token: token,
    nolimit: 1,
    fields:
      "id, nameFr, nameEn, nameNl, parent, isSynonym, isSuperTag, superTag",
    filter: JSON.stringify(filter),
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const saveTag = (token, data, apiUrl) => {
  const requestUrl = `${apiUrl}/blog/tag`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("nameFr", data.nameFr);
  formData.append("nameNl", data.nameNl);
  formData.append("nameEn", data.nameEn);

  if (data.id) {
    formData.append("id", data.id);
  }

  return axios.post(requestUrl, formData);
};

export const saveSuperTag = (token, data, apiUrl) => {
  const requestUrl = `${apiUrl}/blog/tag`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", data.id);
  formData.append("superTag", data.superTag);

  return axios.post(requestUrl, formData);
};
