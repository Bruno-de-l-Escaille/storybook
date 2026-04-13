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

// Error Mapping Utility Functions

/**
 * Maps backend error messages to user-friendly error keys for i18n
 * @param {string} errorMessage - Raw error message from backend
 * @param {string} context - Context where the error occurred (otp, auth, validation, etc.)
 * @returns {string} Error key for i18n lookup
 */
export const mapBackendErrorToI18nKey = (errorMessage, context = "general") => {
  if (!errorMessage || typeof errorMessage !== "string") {
    return "auth.errors.system.server_error";
  }

  const lowerErrorMessage = errorMessage.toLowerCase();

  // OTP-related errors
  if (context === "otp" || lowerErrorMessage.includes("otp")) {
    if (
      lowerErrorMessage.includes("invalid otp") ||
      (lowerErrorMessage.includes("bad request") &&
        lowerErrorMessage.includes("otp"))
    ) {
      return "auth.errors.otp.invalid";
    }
    if (
      lowerErrorMessage.includes("expired") ||
      lowerErrorMessage.includes("expire")
    ) {
      return "auth.errors.otp.expired";
    }
    if (
      lowerErrorMessage.includes("missing") ||
      lowerErrorMessage.includes("required")
    ) {
      return "auth.errors.otp.missing";
    }
    return "auth.errors.otp.network_error";
  }

  // Authentication errors
  if (
    context === "auth" ||
    lowerErrorMessage.includes("credential") ||
    lowerErrorMessage.includes("password") ||
    lowerErrorMessage.includes("login")
  ) {
    if (
      lowerErrorMessage.includes("invalid credentials") ||
      lowerErrorMessage.includes("incorrect") ||
      lowerErrorMessage.includes("wrong")
    ) {
      return "auth.errors.authentication.invalid_credentials";
    }
    if (
      lowerErrorMessage.includes("not found") ||
      lowerErrorMessage.includes("user not found")
    ) {
      return "auth.errors.authentication.account_not_found";
    }
    if (
      lowerErrorMessage.includes("account exists with password") ||
      lowerErrorMessage.includes("already exists")
    ) {
      return "auth.errors.authentication.account_exists_password";
    }
    if (
      lowerErrorMessage.includes("locked") ||
      lowerErrorMessage.includes("suspended")
    ) {
      return "auth.errors.authentication.account_locked";
    }
    if (
      lowerErrorMessage.includes("session") ||
      lowerErrorMessage.includes("token")
    ) {
      return "auth.errors.authentication.session_expired";
    }
    return "auth.errors.authentication.invalid_credentials";
  }

  // Validation errors
  if (
    context === "validation" ||
    lowerErrorMessage.includes("format") ||
    lowerErrorMessage.includes("valid")
  ) {
    if (
      lowerErrorMessage.includes("email") &&
      (lowerErrorMessage.includes("format") ||
        lowerErrorMessage.includes("invalid"))
    ) {
      if (lowerErrorMessage.includes("domain")) {
        return "auth.errors.validation.email_domain_invalid";
      }
      return "auth.errors.validation.email_format";
    }
    if (
      lowerErrorMessage.includes("phone") &&
      (lowerErrorMessage.includes("format") ||
        lowerErrorMessage.includes("invalid"))
    ) {
      if (lowerErrorMessage.includes("length")) {
        return "auth.errors.validation.phone_length";
      }
      return "auth.errors.validation.phone_format";
    }
    if (
      lowerErrorMessage.includes("required") ||
      lowerErrorMessage.includes("missing")
    ) {
      if (lowerErrorMessage.includes("identifier")) {
        return "auth.errors.validation.identifier_required";
      }
      if (lowerErrorMessage.includes("password")) {
        return "auth.errors.validation.password_required";
      }
      if (
        lowerErrorMessage.includes("otp") ||
        lowerErrorMessage.includes("code")
      ) {
        return "auth.errors.validation.otp_required";
      }
    }
    return "auth.errors.validation.email_format";
  }

  // Password errors
  if (context === "password" || lowerErrorMessage.includes("password")) {
    if (
      lowerErrorMessage.includes("too short") ||
      lowerErrorMessage.includes("8 characters")
    ) {
      return "auth.errors.password.too_short";
    }
    if (
      lowerErrorMessage.includes("digit") ||
      lowerErrorMessage.includes("number")
    ) {
      return "auth.errors.password.missing_digit";
    }
    if (lowerErrorMessage.includes("special character")) {
      return "auth.errors.password.missing_special";
    }
    if (lowerErrorMessage.includes("uppercase")) {
      return "auth.errors.password.missing_uppercase";
    }
    if (lowerErrorMessage.includes("lowercase")) {
      return "auth.errors.password.missing_lowercase";
    }
    if (
      lowerErrorMessage.includes("match") ||
      lowerErrorMessage.includes("same")
    ) {
      return "auth.errors.password.mismatch";
    }
    if (
      lowerErrorMessage.includes("old password") ||
      lowerErrorMessage.includes("current password")
    ) {
      return "auth.errors.password.incorrect_old";
    }
    if (
      lowerErrorMessage.includes("already has") ||
      lowerErrorMessage.includes("already set")
    ) {
      return "auth.errors.password.already_set";
    }
    return "auth.errors.password.too_short";
  }

  // Account errors
  if (
    lowerErrorMessage.includes("account") ||
    lowerErrorMessage.includes("user")
  ) {
    if (lowerErrorMessage.includes("not found")) {
      return "auth.errors.account.not_found";
    }
    if (
      lowerErrorMessage.includes("already exists") ||
      lowerErrorMessage.includes("exists")
    ) {
      return "auth.errors.account.already_exists";
    }
    if (
      lowerErrorMessage.includes("in use") ||
      lowerErrorMessage.includes("taken")
    ) {
      return "auth.errors.account.identifier_in_use";
    }
    if (
      lowerErrorMessage.includes("mismatch") ||
      lowerErrorMessage.includes("same type")
    ) {
      return "auth.errors.account.multiple_identifiers_mismatch";
    }
    return "auth.errors.account.not_found";
  }

  // System errors
  if (
    lowerErrorMessage.includes("network") ||
    lowerErrorMessage.includes("connection")
  ) {
    return "auth.errors.system.network_error";
  }
  if (
    lowerErrorMessage.includes("server") ||
    lowerErrorMessage.includes("500") ||
    lowerErrorMessage.includes("503")
  ) {
    return "auth.errors.system.server_error";
  }
  if (
    lowerErrorMessage.includes("send") &&
    (lowerErrorMessage.includes("otp") || lowerErrorMessage.includes("code"))
  ) {
    return "auth.errors.system.otp_send_failed";
  }
  if (
    lowerErrorMessage.includes("token") ||
    lowerErrorMessage.includes("jwt")
  ) {
    return "auth.errors.system.token_generation_failed";
  }
  if (
    lowerErrorMessage.includes("unavailable") ||
    lowerErrorMessage.includes("maintenance")
  ) {
    return "auth.errors.system.service_unavailable";
  }

  // Default fallback
  return "auth.errors.system.server_error";
};

/**
 * Processes an error and returns a user-friendly message
 * @param {Error|string} error - Error object or error message
 * @param {object} i18n - Internationalization object
 * @param {string} language - Current language (en, fr, nl)
 * @param {string} context - Context where the error occurred
 * @returns {string} User-friendly error message
 */
export const processErrorMessage = (
  error,
  i18n,
  language = "en",
  context = "general"
) => {
  let errorMessage = "";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && error.error) {
    errorMessage = error.error;
  } else {
    errorMessage = "Unknown error occurred";
  }

  const errorKey = mapBackendErrorToI18nKey(errorMessage, context);

  // Navigate to the nested error message in i18n
  const keys = errorKey.split(".");
  let message = i18n[language];

  for (const key of keys) {
    if (message && message[key]) {
      message = message[key];
    } else {
      // Fallback to generic error message if key not found
      return i18n[language]?.auth?.error_occurred || "An error occurred";
    }
  }

  return typeof message === "string"
    ? message
    : i18n[language]?.auth?.error_occurred || "An error occurred";
};

/**
 * Enhanced error processing for API responses
 * @param {Response} response - Fetch response object
 * @param {object} errorData - Parsed error data from response
 * @param {object} i18n - Internationalization object
 * @param {string} language - Current language
 * @param {string} context - Context where the error occurred
 * @returns {Error} Enhanced error object with user-friendly message
 */
export const processApiError = (
  response,
  errorData,
  i18n,
  language = "en",
  context = "general"
) => {
  let rawErrorMessage = "";

  // Extract error message from various possible formats
  if (errorData) {
    if (typeof errorData === "string") {
      rawErrorMessage = errorData;
    } else if (errorData.error) {
      rawErrorMessage = errorData.error;
    } else if (errorData.message) {
      rawErrorMessage = errorData.message;
    } else if (errorData.detail) {
      rawErrorMessage = errorData.detail;
    }
  }

  // If no specific error message, use HTTP status
  if (!rawErrorMessage) {
    if (response.status === 400) {
      rawErrorMessage = "Bad request";
    } else if (response.status === 401) {
      rawErrorMessage = "Unauthorized";
    } else if (response.status === 403) {
      rawErrorMessage = "Forbidden";
    } else if (response.status === 404) {
      rawErrorMessage = "Not found";
    } else if (response.status === 500) {
      rawErrorMessage = "Internal server error";
    } else {
      rawErrorMessage = `HTTP ${response.status}`;
    }
  }

  const userFriendlyMessage = processErrorMessage(
    rawErrorMessage,
    i18n,
    language,
    context
  );
  const error = new Error(userFriendlyMessage);
  error.originalMessage = rawErrorMessage;
  error.status = response.status;
  error.context = context;

  return error;
};
