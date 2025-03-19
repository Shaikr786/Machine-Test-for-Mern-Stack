import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(); // Load user if already logged in
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false); // No token, stop loading

      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
      });

      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("❌ Fetch User Error:", error.response?.data || error.message);
      logout(); // Clear token if invalid
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/auth/register", formData);
      const { token, user } = res.data;
  
      if (!token || !user) throw new Error("Invalid registration response");
  
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      setUser(user);
      setIsAuthenticated(true);
  
      return { success: true, user };
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };
  

  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Persist token in API instance

      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"]; // Remove token from API instance
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};
