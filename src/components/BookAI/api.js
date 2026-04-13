// API functions for GoPeopleAuthHeader component
// import { processApiError } from "./utils";
// import { I18N } from "../../i18n";
import { isEmpty } from "../../utils";

export const getProducts = async (token, AiUrl, clientId) => {
  let requestUrl = `${AiUrl}/products`;

  if (!isEmpty(clientId) && clientId !== 0) {
    const searchParams = new URLSearchParams({
      issuer: String(clientId),
    });
    requestUrl = `${requestUrl}?${searchParams}`;
  }

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`, // token added
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching auth access`);
  }
};

export const generateFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((propertyValue) => {
        formData.append(`${key}[]`, propertyValue);
      });
      return;
    }
    formData.append(key, value);
  });

  return formData;
};

export const createOrder = async ({
  token,
  AiUrl,
  fiduciaireId,
  billingCompanyNumber,
  billingOrganization,
  billingStreet,
  billingPostalCode,
  billingSubjectToVAT,
  billingRegion,
  billingDoNotSendInvoice,
  user,
  appRef,
  product_ids,
}) => {
  const requestUrl = `${AiUrl}/billing/order`;
  const data = {
    access_token: token, // token added
    billingCompanyNumber,
    billingOrganization,
    billingStreet,
    billingPostalCode,
    billingSubjectToVAT,
    billingRegion: billingRegion || "",
    billingDoNotSendInvoice,
    user,
    appRef,
    product_ids,
    language: "fr",
  };
  if (fiduciaireId && fiduciaireId !== 0) {
    data.community = fiduciaireId;
  }
  const formData = generateFormData(data);
  const response = await fetch(`${requestUrl}`, {
    method: "POST",
    body: formData,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`, // token added
    },
  });

  let jsonData;

  try {
    jsonData = await response.json();
  } catch (e) {
    throw new Error(
      `HTTP POST error, status: ${
        response.status
      }, url: ${requestUrl}, params: ${JSON.stringify(data)}`
    );
  }

  return { data: jsonData.data ?? jsonData };
};

export const getAuthAccess = async (token, AiUrl, user) => {
  if (!user) {
    throw new Error("userId and collectionId are required");
  }
  const requestUrl = `${AiUrl}/auth`;
  const searchParams = new URLSearchParams({
    user_id: String(user),
  });
  try {
    const response = await fetch(`${requestUrl}?${searchParams}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`, // token added
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching auth access`);
  }
};
