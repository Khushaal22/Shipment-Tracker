import api from './axios';

/**
 * Log in a user with email and password.
 * @param {Object} credentials - The login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} The API response data including user object and token.
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user.
 * @param {Object} userData - The registration data.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
 * @param {string} [userData.phone] - Optional phone number.
 * @param {string} userData.role - The chosen role (sender or tracker).
 * @returns {Promise<Object>} The API response data including user object and token.
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
