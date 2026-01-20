import axios from "axios";

export const validateOrganizationNumber = async (token, ApiUrl, uen) => {
  let requestUrl = `${ApiUrl}/billing/document/validate-uen`;
  const params = {
    access_token: token,
    uen,
  };

  const searchParams = new URLSearchParams(params);

  try {
    const response = await fetch(`${requestUrl}?${searchParams}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        // Authorization: `Bearer ${token}`, // token added
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching auth access`);
  }
};

export const fetchBillingAddress = async (token, ApiUrl, user) => {
  let requestUrl = `${ApiUrl}/billing/document/get-billing-addresses`;
  const params = {
    access_token: token,
    userId: user,
  };
  const searchParams = new URLSearchParams(params);

  try {
    const response = await fetch(`${requestUrl}?${searchParams}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        // Authorization: `Bearer ${token}`, // token added
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching auth access`);
  }
};

export const fetchBillingConfiguration = async ({
  token,
  apiUrl,
  organizationId,
}) => {
  let requestUrl = `${apiUrl}/billing/organization-configuration`;

  const filter = [
    { property: "organization", value: organizationId, operator: "eq" },
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      // fields: ["isPeppolActive"].join(","),
    },
  });
};

export const checkOrganizationExistsInPeppol = ({
  apiUrl,
  token,
  organizationNumber,
}) => {
  const requestUrl = `${apiUrl}/billing/document/check-if-campany-exist-peppol`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      campanyNumber: organizationNumber,
    },
  });
};
