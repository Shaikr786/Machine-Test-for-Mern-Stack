import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUser(); // Load user if already logged in
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/auth/me"); // Token already attached via `api.js`
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Failed to fetch user:", error.response?.data || error.message);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      await fetchUser(); // Fetch user immediately after login
      return { success: true, user: res.data.user }; // Return user data for redirection
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      await fetchUser(); // Fetch user immediately after registration
      return { success: true, user: res.data.user }; // Return user data for redirection
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
