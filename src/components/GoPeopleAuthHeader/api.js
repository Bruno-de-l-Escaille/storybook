// API functions for GoPeopleAuthHeader component

export const initiateAuth = async (apiBaseUrl, identifier) => {
  const response = await fetch(`${apiBaseUrl}/auth/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ otp }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
};

export const requestPasswordReset = async (apiBaseUrl, identifier) => {
  const response = await fetch(`${apiBaseUrl}/auth/request-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
