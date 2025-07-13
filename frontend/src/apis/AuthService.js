import API, { handleApiError } from "./index";

const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.phone - User's phone
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} - Response data
   */
  register: async (userData) => {
    try {
      const response = await API.post("/user/register", userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} - Response data with tokens
   */
  login: async (credentials) => {
    try {
      const response = await API.post("/user/login", credentials);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise<Object>} - New tokens
   */
  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // if (!refreshToken) {
      //   throw new Error('No refresh token available');
      // }

      const response = await API.post("/user/refresh-token", { refreshToken });

      // Update stored tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      return response.data;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} - Response data
   */
  logout: async () => {
    try {
      const response = await API.patch("/user/logout");

      // Clear tokens from storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} - Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await API.get("/user/");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if access token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Get stored access token
   * @returns {string|null} - Access token or null
   */
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  /**
   * Get stored refresh token
   * @returns {string|null} - Refresh token or null
   */
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
};

export default AuthService;
