import axios from "axios";

export const getClientCredential = (apiUrl, clientCredential) => {
  const requestUrl = `${apiUrl}/token`;

  let params = Object.keys(clientCredential)
    .map(function (key) {
      return (
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(clientCredential[key])
      );
    })
    .join("&");

  return axios({
    method: "post",
    url: requestUrl,
    data: params,
  });
};

export const postUserCredential = (apiUrl, data, clientCredential) => {
  const requestUrl = `${apiUrl}/token`;

  var formData = new FormData();
  formData.append("username", data.email);
  formData.append("password", data.password);
  formData.append("grant_type", "password");
  formData.append("scope", clientCredential.scope);
  formData.append("client_id", clientCredential.client_id);
  formData.append("client_secret", clientCredential.client_secret);

  return axios.post(requestUrl, formData);
};

export const postUserEmail = (apiUrl, appName, token, email, language) => {
  const requestUrl = `${apiUrl}/profile/email/ua-add`;

  var formData = new FormData();
  formData.append("email", email);
  formData.append("language", language);
  formData.append("access_token", token);
  formData.append("source", "REGISTER");
  formData.append("app", appName);

  return axios.post(requestUrl, formData);
};

export const postValidateEmailCode = ({
  apiUrl,
  token,
  id,
  email,
  key,
  source = "",
}) => {
  const requestUrl = `${apiUrl}/profile/email/validate-code`;

  var formData = new FormData();
  formData.append("email", email);
  formData.append("key", key);
  formData.append("access_token", token);
  formData.append("id", id);
  if (source) {
    formData.append("source", source);
  }

  return axios.post(requestUrl, formData);
};

export const resetPassword = (apiUrl, token, email, appName) => {
  let requestUrl = `${apiUrl}/organization/user/resetPassword`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("email", email);
  formData.append("source", appName.toLowerCase());

  return axios.post(requestUrl, formData);
};

export const changePassword = ({
  apiUrl,
  token,
  key,
  password,
  passwordConfirm,
}) => {
  let requestUrl = `${apiUrl}/organization/user/newPassword`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("key", key);
  formData.append("password", password);
  formData.append("passwordConfirm", passwordConfirm);

  return axios.post(requestUrl, formData);
};

export const saveUser = (apiUrl, token, data) => {
  let requestUrl = `${apiUrl}/organization/user`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("email[0][email]", data.email);
  formData.append("phone[0][number]", data.phone);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("language", data.language);
  formData.append("gender", data.gender);
  if (data.password) formData.append("password", data.password);
  if (data.confirmPassword)
    formData.append("passwordConfirm", data.confirmPassword);
  if (data.agreation) formData.append("agreation", data.agreation);
  formData.append("isSecure", 1);
  formData.append("uaStatus", "VALIDATED");

  if (data.id) {
    formData.append("id", data.id);
  }

  if (data.role) {
    formData.append("role[0][type]", data.role.type);
    formData.append("role[0][organization]", data.role.organization);
  }

  if (data.organization_id) {
    formData.append("organization_id", data.organization_id);
  }

  return axios.post(requestUrl, formData);
};

export const fetchUserByToken = async (apiUrl, token) => {
  const fields = [
    "*",
    "uid",
    "email",
    "avatar",
    "description",
    "cover",
    "url",
    "roles",
    "blogRole",
    "acceptIaTerms",
  ];
  const requestUrl = `${apiUrl}/organization/user/getCurrentUser`;
  try {
    const response = await axios.get(requestUrl, {
      params: {
        access_token: token,
        fields: fields.join(","),
      },
    });
    return {
      data: response.data.data,
    };
  } catch (e) {
    return { data: undefined };
  }
};

export const getTTPUser = ({ apiUrl, userId, token }) => {
  const filter = [
    {
      property: "id",
      value: userId,
      operator: "eq",
    },
  ];

  const fields = [
    "*",
    "email",
    "avatar",
    "contactSocialNetworks",
    "cover",
    "url",
    "numeroAgreation",
    "blogRole",
    "acceptIaTerms",
  ];

  const requestUrl = `${apiUrl}/organization/user`;

  let params = {
    access_token: token,
    filter: JSON.stringify(filter),
    fields: fields.join(","),
    workspace: "ua",
  };

  return axios.get(requestUrl, {
    params,
  });
};

export const getTokenWithoutPassword = ({ apiUrl, token, key }) => {
  let requestUrl = `${apiUrl}/organization/user/tokenWithoutPassword`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("key", key);

  return axios.post(requestUrl, formData);
};
