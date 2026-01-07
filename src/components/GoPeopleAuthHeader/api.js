// API functions for GoPeopleAuthHeader component

export const initiateAuth = async (apiBaseUrl, identifier, appName = "tamtam", language = "fr") => {
  const queryParams = new URLSearchParams();
  if (appName) queryParams.append("app_name", appName);
  if (language) queryParams.append("language", language);

  const url = `${apiBaseUrl}/auth/initiate${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier }),
  });

  if (response.status === 202) {
    // Account exists with password
    return { message: "Account exists with password" };
  } else if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    // Handle error responses
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const loginWithPassword = async (apiBaseUrl, identifier, password) => {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const initiateOTPLogin = async (apiBaseUrl, identifier, appName = "tamtam", language = "fr") => {
  const queryParams = new URLSearchParams();
  if (appName) queryParams.append("app_name", appName);
  if (language) queryParams.append("language", language);

  const url = `${apiBaseUrl}/auth/login-with-otp/initiate${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const verifyOTP = async (apiBaseUrl, otp, identifier) => {
  const response = await fetch(`${apiBaseUrl}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp, identifier }),
  });

  if (response.ok) {
    const data = await response.json();
    // The API returns a JWT token in the response
    // We need to decode it or check additional fields to determine if user is new
    // For now, we'll assume the API provides this information directly
    return {
      ...data,
      // The API should provide isNewUser flag based on whether this is first-time authentication
      // This would typically be determined by checking if user has completed registration
    };
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const requestPasswordReset = async (apiBaseUrl, identifier) => {
  const response = await fetch(`${apiBaseUrl}/auth/request-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const updateUser = async (apiBaseUrl, token, userId, userData) => {
  // Map the frontend data structure to GoPeople API format
  const apiUserData = {
    firstname: userData.firstName,
    lastname: userData.lastName,
    phone: userData.phone,
    sex:
      userData.gender === "MALE"
        ? "M"
        : userData.gender === "FEMALE"
        ? "F"
        : null,
    main_language: userData.language,
  };

  const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apiUserData),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const setUserPassword = async (apiBaseUrl, token, password) => {
  const response = await fetch(`${apiBaseUrl}/auth/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword: password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const authenticateUser = async (apiBaseUrl, email, password) => {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier: email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
};

export const syncUserCreation = async (apiBaseUrl, token, userId) => {
  const response = await fetch(
    `${apiBaseUrl}/users/sync-user-creation/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
  }
};

// JWT and Auth Context Functions
export const extractAuthContextFromJWT = (jwt) => {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return {
      goPeopleUserId: payload.user_id,
      email: payload.email,
      phone: payload.phone,
      selectedOrganizationId: payload.selected_organization_id,
      ttpUserId: payload.apittpp_user_id || payload.apiTtpUserId,
      ttpAccessToken: payload.apiTtp_token?.access_token,
      role: payload.role,
      exp: payload.exp,
      jti: payload.jti,
    };
  } catch (error) {
    throw new Error(
      `Failed to extract auth context from JWT: ${error.message}`
    );
  }
};

export const getGoPeopleUserProfile = async (apiBaseUrl, jwt) => {
  const response = await fetch(`${apiBaseUrl}/users/me/complete-profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return { data: { data: [data] } }; // Wrap to match expected structure
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
  }
};

// User data is always fetched from GoPeople API only
// No TTP API user fetching needed

export const getOrganizationSettings = (
  apiUrl,
  ttpAccessToken,
  organizationId
) => {
  // Use TTP access token (not JWT) for this request
  const TTP_API_URL = apiUrl; // Replace with actual URL or config
  const requestUrl = `${TTP_API_URL}/organization/organization-settings`;

  if (!ttpAccessToken) {
    return Promise.reject(new Error("TTP access token is required"));
  }
  if (!organizationId) {
    return Promise.reject(new Error("organizationId is required"));
  }

  const params = {
    access_token: ttpAccessToken,
    id: 4,
  };

  // Simple GET request without custom headers to avoid CORS preflight
  const queryParams = new URLSearchParams(params).toString();
  return fetch(`${requestUrl}?${queryParams}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching organization settings:", error);
      // Return default settings if API call fails
      return {
        blogPreferences: {
          showAuthorCard: true,
          allowComments: true,
          moderateComments: false,
        },
      };
    });
};
