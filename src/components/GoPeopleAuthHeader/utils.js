// Utility functions for GoPeopleAuthHeader component

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Remove any non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;

  // Also allow phones without + if they are 10-15 digits
  const phoneWithoutPlusRegex = /^\d{10,15}$/;

  return phoneRegex.test(cleanPhone) || phoneWithoutPlusRegex.test(cleanPhone);
};

export const formatPhone = (phone) => {
  // Remove any non-digit characters except +
  let cleanPhone = phone.replace(/[^\d+]/g, "");

  // If it doesn't start with + and is a valid length, add +
  if (!cleanPhone.startsWith("+") && cleanPhone.length >= 10) {
    cleanPhone = "+" + cleanPhone;
  }

  return cleanPhone;
};

export const cleanEmail = (email) => {
  return email.trim().toLowerCase();
};

// JWT Utility Functions

/**
 * Decode JWT payload (client-side, no verification)
 * @param {string} token - JWT token string
 * @returns {object} Decoded JWT payload
 * @throws {Error} If token is invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Token must be a valid string");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(paddedPayload));

    return decoded;
  } catch (error) {
    throw new Error(`Invalid JWT token: ${error.message}`);
  }
};

/**
 * Extract user information from decoded JWT token
 * @param {object} decodedToken - Decoded JWT payload
 * @returns {object} User information object
 */
export const extractUserInfo = (decodedToken) => {
  if (!decodedToken || typeof decodedToken !== "object") {
    throw new Error("Decoded token must be a valid object");
  }

  return {
    userId: decodedToken.user_id || "",
    email: decodedToken.email || "",
    phone: decodedToken.phone || "",
    subject: decodedToken.sub || "",
    issuer: decodedToken.iss || "",
    issuedAt: decodedToken.iat || 0,
    expiresAt: decodedToken.exp || 0,
    notBefore: decodedToken.nbf || 0,
    jwtId: decodedToken.jti || "",
  };
};

/**
 * Extract Symfony API token from decoded JWT token
 * @param {object} decodedToken - Decoded JWT payload
 * @returns {object} API TTP token object
 */
export const extractApiTtpToken = (decodedToken) => {
  if (!decodedToken || typeof decodedToken !== "object") {
    return {
      access_token: "",
      expires_in: 0,
      scope: "",
    };
  }

  const apiTtpToken = decodedToken.apiTtp_token || {};

  return {
    access_token: apiTtpToken.access_token || "",
    expires_in: apiTtpToken.expires_in || 0,
    scope: apiTtpToken.scope || "",
  };
};

/**
 * Check if JWT token is expired
 * @param {object} decodedToken - Decoded JWT payload
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (decodedToken) => {
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return decodedToken.exp < now;
};

/**
 * Get token expiration time in milliseconds
 * @param {object} decodedToken - Decoded JWT payload
 * @returns {number} Expiration timestamp in milliseconds
 */
export const getTokenExpirationTime = (decodedToken) => {
  if (!decodedToken || !decodedToken.exp) {
    return 0;
  }

  return decodedToken.exp * 1000;
};

/**
 * Normalize authentication data to a consistent format
 * @param {object} processedData - Processed token data (from JWT or legacy format)
 * @param {string} env - Environment (e.g., 'dev', 'prod')
 * @param {object} app - Application configuration object
 * @returns {object} Normalized authentication data
 */
export const normalizeAuthData = (processedData, env, app) => {
  // Check if the data comes from a JWT with embedded apiTtp_token
  if (processedData.apiTtpToken) {
    const { userInfo, apiTtpToken } = processedData;
    console.log(
      "Processing JWT token with embedded apiTtp_token",
      processedData.access_token
    );
    return {
      id: userInfo.userId,
      token: apiTtpToken.access_token,
      expiresIn: apiTtpToken.expires_in,
      createdAt: userInfo.issuedAt,
      scope: apiTtpToken.scope,
      extra: {
        lang: userInfo.language || "en", // Default to "en" if not provided
        env,
      },
      email: userInfo.email,
      phone: userInfo.phone,
      jti: userInfo.jwtId,
      exp: userInfo.expiresAt,
    };
  } else {
    // Legacy opaque token format
    const { sha256 } = require("js-sha256");
    const salt = "Aqwxsz32$";
    const time = Math.floor(Date.now() / 1000);

    return {
      id: processedData.data.user.id,
      token: processedData.token.access_token,
      expiresIn: processedData.token.expires_in,
      createdAt: processedData.token.createdAt,
      scope: processedData.token.scope,
      extra: {
        lang: processedData.data.user.language || "en",
        env,
      },
      email: processedData.data.user.mainEmail,
      key: sha256(
        processedData.data.user.email +
          time +
          processedData.token.access_token +
          salt
      ),
      time,
      app: app.authAppName,
    };
  }
};

/**
 * Process JWT token and extract all relevant information
 * @param {string} token - JWT token string
 * @returns {object} Complete token data object
 */
export const processJWTToken = (token) => {
  try {
    const decodedToken = decodeJWT(token);
    const userInfo = extractUserInfo(decodedToken);
    const apiTtpToken = extractApiTtpToken(decodedToken);
    const expired = isTokenExpired(decodedToken);
    const expirationTime = getTokenExpirationTime(decodedToken);

    return {
      token,
      userInfo,
      apiTtpToken,
      decodedToken,
      isExpired: expired,
      expirationTime,
    };
  } catch (error) {
    throw error;
  }
};
