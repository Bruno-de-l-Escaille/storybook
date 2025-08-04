// API functions for GoPeopleAuthHeader component

export const initiateAuth = async (apiBaseUrl, identifier) => {
  const response = await fetch(`${apiBaseUrl}/auth/initiate`, {
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
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}`);
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
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
};

export const verifyOTP = async (apiBaseUrl, otp) => {
  const response = await fetch(`${apiBaseUrl}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}`);
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}`
    );
  }
};
