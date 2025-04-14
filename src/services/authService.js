import API from "./api";  // Make sure API is configured correctly

const AuthService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await API.post("/api/auth/login", credentials);
      const { token, refreshToken, sessionId, userId, role } = response.data;

      // Store the tokens and user info in localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("sessionId", sessionId); // Storing sessionId for further use if needed

      return response.data; // Return response to use in component (e.g., navigate)
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error; // Rethrow error to be handled elsewhere
    }
  },

  // Refresh token function (if necessary later)
  refreshToken: async (refreshToken) => {
    try {
      const response = await API.post("/api/auth/refresh-token", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default AuthService;
