import axios from "axios";

export const saveAgreation = ({ apiUrl, token, userId, data }) => {
  const requestUrl = `${apiUrl}/event/user/save-agreation-data`;

  let formData = new FormData();
  formData.append("access_token", token);
  formData.append("user", userId);
  formData.append("userAgreationData", data);

  return axios.post(requestUrl, formData);
};
