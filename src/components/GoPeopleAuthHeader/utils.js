// Utility functions for GoPeopleAuthHeader component

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Remove any non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;
  
  // Also allow phones without + if they are 10-15 digits
  const phoneWithoutPlusRegex = /^\d{10,15}$/;
  
  return phoneRegex.test(cleanPhone) || phoneWithoutPlusRegex.test(cleanPhone);
};

export const formatPhone = (phone) => {
  // Remove any non-digit characters except +
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with + and is a valid length, add +
  if (!cleanPhone.startsWith('+') && cleanPhone.length >= 10) {
    cleanPhone = '+' + cleanPhone;
  }
  
  return cleanPhone;
};

export const cleanEmail = (email) => {
  return email.trim().toLowerCase();
};
