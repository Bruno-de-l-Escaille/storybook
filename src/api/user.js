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
