import axios from "axios";

export const saveAgreation = ({ apiUrl, token, userId, data }) => {
  const requestUrl = `${apiUrl}/event/user/save-agreation-data`;

  let formData = new FormData();
  formData.append("access_token", token);
  formData.append("user", userId);
  formData.append("userAgreationData", data);

  return axios.post(requestUrl, formData);
};

export const getOrganizationsRoles = (apiUrl, token, userId) => {
  const requestUrl = `${apiUrl}/organization/role`;
  const filter = [
    { property: "user", value: userId, operator: "eq" },
    {
      property: "type",
      value: ["OFFICIAL", "MANAGER", "LEGAL_REPRESENTATIVE"],
      operator: "in",
    },
  ];
  const fields = ["*", "organizationSize"];
  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const getUser = (apiUrl, token, userId) => {
  const requestUrl = `${apiUrl}/organization/user`;
  const filter = [
    { property: "id", value: userId, operator: "eq" },
    {
      property: "role.type",
      value: ["OFFICIAL", "MANAGER", "LEGAL_REPRESENTATIVE", "EXTERNAL"],
      operator: "in",
    },
  ];
  const fields = ["*", "role", "roles", "userSettings", "organizationSize"];
  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
      start: 0,
      limit: 10,
      workspace: "admin",
    },
  });
};

export const fetchOrganizations = (apiUrl, token, userId) => {
  const requestUrl = `${apiUrl}/organization/user-organizations`;
  const fields = [
    "*",
    "url",
    "avatarWebPath",
    "membershipOrder",
    "organizationSize",
  ];
  return axios.get(requestUrl, {
    params: {
      access_token: token,
      userId: userId,
      fields: fields.join(","),
    },
  });
};

export const searchSpeakers = ({
  apiUrl,
  token,
  searchValue,
  organizationId,
}) => {
  const requestUrl = `${apiUrl}/blog/avatar/avatars-and-authors`;
  const filter = [{ property: "name", value: searchValue, operator: "like" }];
  const fields = [
    "*",
    "email",
    "mediaChain",
    "avatar",
    "blogRoleInOrganization",
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
      limit: 5,
      start: 0,
      organization_id: organizationId,
    },
  });
};

export const createUserByEmail = ({
  email,
  firstName,
  lastName,
  gender,
  language,
  apiUrl,
  token,
}) => {
  const requestUrl = `${apiUrl}/organization/saveUserByEmail`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("email", email);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("gender", gender);
  formData.append("language", language);

  return axios.post(requestUrl, formData);
};
