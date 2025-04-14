import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = async (credentials) => {
    try {
      const data = await AuthService.login(credentials);
      const authInfo = {
        token: data.token,
        role: data.role,
        userId: data.userId,
      };

      // ✅ Store auth info in both state and localStorage
      setAuthData(authInfo);
      localStorage.setItem("token", authInfo.token);
      localStorage.setItem("role", authInfo.role);
      localStorage.setItem("userId", authInfo.userId);
      localStorage.setItem("authData", JSON.stringify(authInfo)); // Optional: helpful for fallback
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuthData(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token && role && userId) {
      setAuthData({ token, role, userId });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
