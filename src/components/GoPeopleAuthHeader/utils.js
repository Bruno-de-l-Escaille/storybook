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
 * Check if JWT token is valid (not expired and properly formatted)
 * @param {string} jwt - JWT token string
 * @returns {boolean} True if token is valid
 */
export const isJWTValid = (jwt) => {
  try {
    const decodedToken = decodeJWT(jwt);
    return !isTokenExpired(decodedToken);
  } catch (error) {
    return false;
  }
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
      processedData.token
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
      jwt: processedData.token, // Include the JWT token itself
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

// Utility functions for slug generation
export const toSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Cookie utilities
export const setCookie = (name, value, expires, path = "/", domain = null) => {
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

// Navigation community utilities
export const getUserCurrentNavCommunity = (userData, currentCommunityId) => {
  if (!userData || !userData.communities) return null;

  const community = userData.communities.find(
    (c) =>
      c.id === currentCommunityId ||
      c.ttp_organization_id === currentCommunityId
  );

  if (community) {
    return {
      id: community.ttp_organization_id || community.id,
      name: community.short_name || community.name,
      url:
        community.url ||
        `/${toSlug(community.official_name || community.name)}`,
      uuid: community.uuid,
      official_name: community.official_name || community.name,
      blogPreferences: community.blogPreferences || {},
    };
  }

  // Return first community if no specific match
  if (userData.communities.length > 0) {
    const firstCommunity = userData.communities[0];
    return {
      id: firstCommunity.ttp_organization_id || firstCommunity.id,
      name: firstCommunity.short_name || firstCommunity.name,
      url:
        firstCommunity.url ||
        `/${toSlug(firstCommunity.official_name || firstCommunity.name)}`,
      uuid: firstCommunity.uuid,
      official_name: firstCommunity.official_name || firstCommunity.name,
      blogPreferences: firstCommunity.blogPreferences || {},
    };
  }

  return null;
};

/**
 * Create complete auth state object matching the required structure
 * @param {object} authData - Raw authentication data
 * @param {object} userData - User profile data
 * @param {object} preferences - Organization preferences
 * @param {string} env - Environment
 * @returns {object} Complete auth state object
 */
export const createCompleteAuthState = (
  authData,
  userData,
  preferences,
  env
) => {
  console.log(
    "authDatadata, userData, preferences:====",
    authData,
    userData,
    preferences
  );
  const navCommunity = getUserCurrentNavCommunity(
    userData,
    userData.selectedOrganization?.ttp_organization_id
  );
  console.log("navcommunity:====", navCommunity);
  return {
    blogPreferences: preferences?.blogPreferences || null,
    createdAt: authData.createdAt || null,
    currentCommunity: navCommunity?.id || 4,
    email: userData.mainEmail || authData.email,
    error: null,
    exp: authData.exp,
    expiresIn: authData.expiresIn,
    extra: authData.extra,
    fetched: true,
    fetching: false,
    isSubscribed: false,
    jti: authData.jti,
    jwtToken: authData.jwt,
    refreshToken: authData.refreshToken,
    navCommunity,
    phone: userData.phone || authData.phone,
    saving: false,
    savingError: null,
    scope: authData.scope,
    stoken: "",
    token: authData.token,
    ttpOrganizationId: navCommunity?.id || null,
    ttpUserId: userData.id || authData.id,
    user: {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mainEmail: userData.mainEmail,
      phone: userData.phone,
      language: userData.language,
      communities: userData.communities || [],
      roles: userData.roles || [],
      organizations: userData.organizations || [],
      selectedOrganization: userData.selectedOrganization,
      selectedOrganizationUuid: userData.selectedOrganization?.uuid || null,
      pages: userData.pages || [],
      socialNetworks: userData.socialNetworks || [],
      contactSocialNetworks: userData.contactSocialNetworks || [],
      groups: userData.groups || [],
    },
  };
};
