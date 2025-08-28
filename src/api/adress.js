const TTP_API_URL = "https://api.staging.tamtam.pro";
export const validateOrganizationNumber = async (token, uen) => {
  let requestUrl = `${TTP_API_URL}/billing/document/validate-uen`;
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

export const fetchBillingAddress = async (token, user) => {
  let requestUrl = `${TTP_API_URL}/billing/document/get-billing-addresses`;
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
